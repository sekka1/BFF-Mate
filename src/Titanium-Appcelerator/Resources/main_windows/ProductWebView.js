/////////////////////////////////////////////////
// Display the Product in a webview
/////////////////////////////////////////////////

var ProductWebView = {

	DetailPageURL: '',
	webview:Titanium.UI.createWebView({
		top:60,
		scalesPageToFit:false
	}),
	blankImage:Titanium.UI.createImageView({ // To cover the logout button
				image:'../images/templates/multi-color/blank_white.png',
				width:Ti.Platform.displayCaps.platformWidth * 0.31,
				height:Ti.Platform.displayCaps.platformHeight * 0.09,
				bottom:5
	}),
	actInd:Titanium.UI.createActivityIndicator({
			top:5,
			right:15,
			height:50,
			width:10,
			font:{fontFamily:'Helvetica Neue',fontSize:20,fontWeight:'bold'},
			color:'white',
			message:'',
			style:'BIG',
	}),
	main:function(){
		
		this.webview.url = this.DetailPageURL;
		this.show();
	},
	show:function(){
		
		// Set Navigation Title
		NavigationBar.titleName.text = '      Place Order';
		NavigationBar.btnBack.action = 'ProductWebView';
	
		if( this.isAddedToWin ){
			// This objects element has already been added to the window.  You can just show it
		
			// Navigation bar
			NavigationBar.show();
		
			//this.webview.show();
			
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
			win.add(this.webview);
			this.webview.hide();
			
			// Activity Indicator
			win.add( this.actInd );
		}
		
		this.webview.addEventListener("beforeload", function(e){
			ProductWebView.actInd.show();
		});
		
		this.webview.addEventListener("load", function(e){
			ProductWebView.actInd.hide();
			ProductWebView.webview.show();
		});
	},
	hide:function(){
	
		//this.DetailPageURL = 'http://www.google.com';
		//this.webview.reload();
	
		this.actInd.hide();
		this.webview.hide();
		this.blankImage.hide();
	}
}