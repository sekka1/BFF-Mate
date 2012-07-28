/////////////////////////////////////////////////
// Display the Friends Lists Function
/////////////////////////////////////////////////
var FriendsList = {

	testCount:0,
	testDidShow:false,
	isAddedToWin:false,
	didSetFriendsList:false,
	tableViewCurrentSelectedRow:-1,
	friendsList:'', // FB json return
	search: search = Titanium.UI.createSearchBar({
			showCancel:true,
			opacity:1.0,
	}),
	tableview:Titanium.UI.createTableView({
			top:60,
			//backgroundImage:'../images/templates/multi-color/MGB-AppBGWatermark.png',
			opacity:1.0,
			search:this.search,
			filterAttribute:'title'
	}),
	blankImage:Titanium.UI.createImageView({ // To cover the logout button
				image:'../images/templates/multi-color/blank_white.png',
				width:Ti.Platform.displayCaps.platformWidth * 0.31,
				height:Ti.Platform.displayCaps.platformHeight * 0.09,
				bottom:5
	}),
	actInd:Titanium.UI.createActivityIndicator({
			top:5,
			right:20,
			height:50,
			width:10,
			font:{fontFamily:'Helvetica Neue',fontSize:20,fontWeight:'bold'},
			color:'white',
			message:'',
			style:'BIG',
	}),
	main:function(){
		
		if( Titanium.Facebook.loggedIn ){
			// Still has a valid FB auth token
		
			this.getData();
			this.show();
		} else {
			// FB auth token has expired
			
			FriendsList.hide();
			Login.show();
		}
	},
	show:function(){
	
		///////////////////////////////////////////////
		this.testCount++; // Debuging.  Counting how many times the tableview click event happens
		this.testDidShow = false; // setting it so it only clicks one time.  have to fix this
		////////////////////////////////////////////////

		// Set Navigation Items
		NavigationBar.titleName.text = 'Friends';
		NavigationBar.btnBack.action = 'FriendsList';
	
		if( this.isAddedToWin ){
			// This objects element has already been added to the window.  You can just show it
		
			// Navigation bar
			NavigationBar.show();
		
			this.tableview.show();
			
			this.blankImage.show();

		} else {
			// This object elements has not been added to the current window.  Add them.
		
			this.isAddedToWin = true;
			
			// Navigation bar
			NavigationBar.show();
			
			// This is to cover up the facebook logout button on subsequent pages
			// I was unable to remove it from the window
			win.add( this.blankImage );
			
			// Table
			win.add(this.tableview);
			
			// Activity Indicator
			win.add( this.actInd );
		}
		
		if( ! FriendsList.didSetFriendsList )
			this.actInd.show();
			
		// Reset the Friends top interest data to nothing.
		FriendsTopSearchList.didGetInterestData = false;		
		FriendsTopSearchList.interestData = '';
	},
	hide:function(){
	
		NavigationBar.hide();
		this.tableview.setData([]);
		this.actInd.hide();
		this.tableview.hide();
		this.blankImage.hide();
		this.search.blur();
	},
	clearFriendsList:function(){
	
		this.didSetFriendsList = false;
		this.friendsList = '';
		this.tableViewCurrentSelectedRow = -1;
	},
	getData:function(){

		if( ! FriendsList.didSetFriendsList ){

			Titanium.Facebook.requestWithGraphPath('me/friends', {}, 'GET', function(e) {
				if (e.success) {
					//Ti.API.info(e.result);
					Ti.API.info( '---Loading New friends list----' );
			
					// Save friends list
					FriendsList.friendsList = e.result;
					
					// FIX - Turning this off for now.  It is not the fetch of the friends that
					// is making it slow.  It is the loading all these items into the tableview
					// But we can keep this here for a good example of how to keep the data for
					// the other views
					//FriendsList.didSetFriendsList = true;
			
					FriendsList.fillRows( FriendsList.friendsList );
					
					FriendsList.actInd.hide();
					
					// Scroll to previous position in the friends list
					if( FriendsList.tableViewCurrentSelectedRow != -1 )
						FriendsList.tableview.scrollToIndex( FriendsList.tableViewCurrentSelectedRow );
			
				} else if (e.error) {
					alert(e.error);
				} else {
					alert('Unknown response');
				}
			});
		} else {
		
			Ti.API.info( '---Loading Saved friends list----' );
		
			this.fillRows( FriendsList.friendsList );
			
			this.actInd.hide();
		}
	},
	fillRows:function( result ){

		results = eval('('+result+')');
						
		Ti.API.info( '# of fb friends: ' + results.data.length );
 
 		// Sorting the Facebook Friends List
		var sort_by = function(field, reverse, primer){

		   reverse = [1,-1][+!!reverse];
		   primer  = primer || function(x){return x};
		
		   return function (a,b) {    
		
			   a = primer(a[field]);
			   b = primer(b[field]);
		
			   return (reverse * 
					  ((a < b) ? -1 :
					   (a > b) ? +1 :
								  0));
		   }
		}
								
		results.data.sort( sort_by('name', false, function(a){return a.toUpperCase()} ) );
 
 		var tableData = [];
 		
 		// Add "Me" onto top of the list
 		tableData.push( {title:"Me",hasChild:true,color:"black",id:Titanium.Facebook.uid,number:0,font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'}} );
 		
		for (var i=0;i<results.data.length;i++){

			// Loading the tableview this way is way faster than creating a rowview for each item
			tableData.push( {title:results.data[i].name,hasChild:true,color:"black",id:results.data[i].id,number:i,font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'}} );
		}
		
		this.tableview.data = tableData;
		
		this.tableview.addEventListener('click', function(e){
		
			if( ! FriendsList.testDidShow ){ // Delete me when this problem is figured out!!
			
				FriendsList.testDidShow = true;
			
				Ti.API.info( '---------------FriendsList tableview.addEventListener---------------' + FriendsList.testCount );
				Ti.API.info( 'in tableview click event listener: ' + e.row.id  );
				Ti.API.info( "Titanium.Facebook.accessToken: " + Titanium.Facebook.accessToken );
				Ti.API.info( 'tableview.index: ' + e.row.number );
				
				// Set row number so it automatically goes back to this spot when user goes back
				FriendsList.tableViewCurrentSelectedRow = e.row.number;
				
				FriendsList.hide();
				
				FriendsTopSearchList.fbID = e.row.id;
				FriendsTopSearchList.accessToken = Titanium.Facebook.accessToken;
				FriendsTopSearchList.main();				
			}			
		});
	
	}
};