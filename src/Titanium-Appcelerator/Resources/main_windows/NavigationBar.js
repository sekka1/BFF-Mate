////////////////////////////////
// Navigation Bar
////////////////////////////////
var NavigationBar = {

	isAddedToWin:false,
	backButtonAction:'',
	nav_bar:Titanium.UI.createImageView({
        image:'',
        top:0,
        left:0,
        height:'60',
        //width:PlatformParameters.navBarHeight,
	    borderWidth: 0,
	    borderRadius: 0
	}),
	btnBack:Titanium.UI.createButton({  
		title:'',
		backgroundImage:'../images/templates/multi-color/back.png',
		backgroundSelectedImage: '../images/templates/multi-color/back_over.png',
		top:10,  
		left:2,
		width:88,  
		height:32,
		borderRadius:1,  
		font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
	}),
	titleName:Titanium.UI.createLabel({  
			text:'',  
			top:10,  
			//left:125,
			textAlign:'center',
			font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},
			borderRadius:0,  
			height:'auto',
			color:'white'
	}),
	main:function(){
		
		this.show();
	},
	show:function(){
	
		if( this.isAddedToWin ){
			// This objects element has already been added to the window.  You can just show it
			
			this.nav_bar.image = PlatformParameters.navBarImage;

			this.nav_bar.show();
			this.btnBack.show();
			this.titleName.show();

		} else {
			// This object elements has not been added to the current window.  Add them.
		
			this.isAddedToWin = true;

			win.add(this.nav_bar);
			win.add(this.btnBack);
			win.add(this.titleName);
		}
	},
	hide:function(){
		this.nav_bar.hide();
		this.btnBack.hide();
		this.titleName.hide();
	},
	addEventListener:function(){
		
		this.btnBack.addEventListener('click', function(e)
		{
			Ti.API.info( '--Back Button Click: ' + e.source.action );
		
			if( e.source.action == 'FriendsList' ){
		
			   FriendsList.hide();
			   Login.show();
			}
		   if( e.source.action == 'FriendsTopSearchList' ){
		   
				FriendsTopSearchList.hide();
				FriendsList.main();
		   }
			if( e.source.action == 'SearchResults' ){
		
			   SearchResults.hide();
			   FriendsTopSearchList.main();
		   }
		   if( e.source.action == 'ProductWebView' ){
		
				ProductWebView.hide();
				SearchResults.main();
		   }
		});
	}
}