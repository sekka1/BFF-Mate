/////////////////////////////////////////////////
// Fills in Platform Specific information
/////////////////////////////////////////////////
var PlatformParameters = {

	navBarImage:'',
	navBarHeight:'',
	navBarWidth:'',
	selectPlatform:function(){
		
		if( Titanium.Platform.name == 'android' ){
			this.android();
		}
		if( Titanium.Platform.name == 'iPhone OS' ){
			this.iPhone();
		}
	},
	android:function(){
		
		this.navBarImage = '../images/templates/multi-color/nav-bar-blank-android.png';
		this.navBarHeight = 60;
		this.navBarWidth = '';
	},
	iPhone:function(){
		
		this.navBarImage = '../images/templates/multi-color/nav-bar-blank-iphone.png';
		this.navBarHeight = 60;
		this.navBarWidth = 480;
	}
};