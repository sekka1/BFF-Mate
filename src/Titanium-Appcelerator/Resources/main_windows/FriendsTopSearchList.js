/////////////////////////////////////////////////
// Display the Friends Top Search List
/////////////////////////////////////////////////

var FriendsTopSearchList = {

	testCount:0,
	testDidShow:false,
	isAddedToWin:false,	
	fbID: '',
	accessToken: '',
	interestData:'',
	didGetInterestData:false,
	xhr:Titanium.Network.createHTTPClient(),
	tableview:Titanium.UI.createTableView({
				top:60,
				opacity:1//0.4
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
	
		Ti.API.info( 'fbID: ' + this.fbID );
		
		win.setBackgroundImage('../images/templates/multi-color/MGB-AppBGWatermark.png');

		// Set Navigation Items
		NavigationBar.titleName.text = '  Find Gifts';
		NavigationBar.btnBack.action = 'FriendsTopSearchList';

		if( this.isAddedToWin ){
			// This objects element has already been added to the window.  You can just show it
		
			// Navigation bar
			NavigationBar.show();
			
			this.blankImage.show();
		
			this.tableview.show();

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
		
		if( ! this.didGetInterestData )
			this.actInd.show();
	},
	hide:function(){

		this.tableview.setData([]);
		NavigationBar.hide();
		this.actInd.hide();
		this.tableview.hide();
		this.blankImage.hide();
	},
	getData:function(){
	
		Ti.API.info( 'getData' );
		
		if( ! this.didGetInterestData ){
		
			///////////////////////////////////////////////
			// Query the Gift Engine for Top Interest
			///////////////////////////////////////////////
			
			this.xhr.onload = function(e) {
				Ti.API.info( 'in onload: ' );
				
				FriendsTopSearchList.didGetInterestData = true;
				
				FriendsTopSearchList.interestData = this.responseText;
							
				FriendsTopSearchList.fillRows( this.responseText );
				
				FriendsTopSearchList.actInd.hide();
			};
			
			// Sending accessToken to the web server to get this user's facebook info to recommend something
			//this.xhr.open('GET', win.site_url + 'data/index/class/GiftEngine/method/getTopCategoryListMobile/userID/'+this.fbID+'/accessToken/'+this.accessToken, true);
			this.xhr.open('GET', win.site_url + 'data/index/class/GiftEngine/method/getInterestsData/userID/'+this.fbID+'/accessToken/'+this.accessToken, true);
	
			this.xhr.send();	
		} else {
			// Already have the data and just use that
			
			this.fillRows( this.interestData );
		}
	},
	fillRows:function( responseText ){
	
		Ti.API.info( 'in fillRows: ' );

		//Ti.API.info( 'this.topSearchList: ' + responseText );
		var results = JSON.parse( responseText );
	
		var interests = results[0].interests;
		var personaType = results[1].persona;
	
		//Ti.API.info( 'results length: ' + results.length );
		//Ti.API.info( 'interest length: ' + results[0].interests.length );
		//Ti.API.info( 'interest[0] name: ' + interests[0].name );
		
		//Ti.API.info( 'personaType value: ' + personaType[0].name );
		//Ti.API.info( 'personaType value: ' + personaType[0].value );
				
		var tableData = [];
		
		var includeHearder = true;  // Put header into the table view for Persona and Interest
		
		for( var n=0; n<personaType.length; n++ ){
			
			if( includeHearder )
				tableData.push( {title:personaType[n].name,name:personaType[n].name,productType:'persona',header:'By Personality',backgroundColor:'white',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black',hasDetail:true} );
			else
				tableData.push( {title:personaType[n].name,name:personaType[n].name,productType:'persona',backgroundColor:'white',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black',hasDetail:true} );
		
			includeHearder = false;
		}

		includeHearder = true;

		for (var i=0;i<interests.length;i++){

			// Loading the tableview this way is way faster than creating a rowview for each item
			
			if( includeHearder )
				tableData.push( {title:interests[i].name,name:interests[i].name,productType:'interest',header:'By Interest',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black',hasDetail:true} );
			else
				tableData.push( {title:interests[i].name,name:interests[i].name,productType:'interest',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black',hasDetail:true} );
			
			includeHearder = false;
		}
		
		// Put a default row to let the user there is no results
		if( personaType.length == 0 && interests.length == 0 ){
			Ti.API.info( 'No results' );
			tableData.push( {title:"Sorry we did not find any",name:'kindle',productType:'interest',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'}, {title:"recommendations for",name:'Canon PowerShot ELPH 300',productType:'interest',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'}, {title:"this friend",name:'Kindle fire',productType:'interest',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'} );
		}						    

		this.tableview.data = tableData;
			
		/////////////////////////////////////////////////
		// Event Listener for the row click
		/////////////////////////////////////////////////
		this.tableview.addEventListener('click', function(e){
		
			if( ! FriendsTopSearchList.testDidShow ){ // Delete me when this problem is figured out!!
			
				FriendsTopSearchList.testDidShow = true;
				
				Ti.API.info( '---------------------FriendsTopSearchList tableview click---------');
				
				FriendsTopSearchList.hide();
				
				SearchResults.queryItem = e.row.name;
				SearchResults.productType = e.row.productType;
				SearchResults.main();		
			}
		});
	}
};
