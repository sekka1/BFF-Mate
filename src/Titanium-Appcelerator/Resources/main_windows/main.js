var win = Titanium.UI.currentWindow;

Ti.API.info( "availableMemory: " + Titanium.Platform.availableMemory );

// Pin orientation
win.orientationModes = [Titanium.UI.PORTRAIT];

/////////////////////////////////////////////////
// Include All the various pages files
/////////////////////////////////////////////////
Ti.include('PlatformParameters.js');
Ti.include('NavigationBar.js');
Ti.include('Login.js');
Ti.include('FriendsList.js');
Ti.include('FriendsTopSearchList.js');
Ti.include('SearchResults.js');
Ti.include('ProductWebView.js');


/////////////////////////////////////////////////
// Display
/////////////////////////////////////////////////

// Set platform specific parameters
PlatformParameters.selectPlatform();

// Setup Navigation Bar
NavigationBar.main();
NavigationBar.addEventListener();
//NavigationBar.hide();

// Loading login page
Login.main();


var screenW = Ti.Platform.displayCaps.platformWidth;
var screenH = Ti.Platform.displayCaps.platformHeight;
 
Ti.API.info('Width ' + screenW + ' Height ' + screenH);
Ti.API.info( 'Platform: ' + Titanium.Platform.name );
Ti.API.info( 'Navbar: ' + PlatformParameters.navBarImage );