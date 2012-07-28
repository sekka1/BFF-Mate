////////////////////////////////
// Make query to the backend to get Amazon Search results
////////////////////////////////
var SearchResults = {

	testCount:0,
	testDidShow:false,
	isAddedToWin:false,	
	queryItem: '', // String to query for a product search
	productType: '', // What type is this; Interest or Persona Type
	xhr:Titanium.Network.createHTTPClient(),
	tableview: Titanium.UI.createTableView({
			top:60
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
	
		this.getData();
		this.show();
	},
	show:function(){
	
		///////////////////////////////////////////////
		this.testCount++; // Debuging.  Counting how many times the tableview click event happens
		this.testDidShow = false; // setting it so it only clicks one time.  have to fix this
		////////////////////////////////////////////////
		
		// Set Navigation Items
		NavigationBar.titleName.text = 'Products';
		NavigationBar.btnBack.action = 'SearchResults';
	
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
		
		this.actInd.show();
	},
	hide:function(){
	
		this.tableview.setData([]);
		this.actInd.hide();
		this.tableview.hide();
		this.blankImage.hide();
	},
	getData:function(){

		this.xhr.onload = function() {
	
			SearchResults.fillRows( this.responseText );
			
			SearchResults.actInd.hide();
		};
		
		/////////////////////////////////////////////////
		// Fix query string so that it is url safe
		/////////////////////////////////////////////////
		var queryItem_url_safe = this.queryItem.replace( / /g, "%20" );
		
		var url = '';
		
		// Amazon search URL
		if( this.productType == 'interest' )
			url = win.site_url + "data/index/class/ProductSearch/method/searchMobile/numberOfItems/24/searchIndex/1/priceRange/%5B0,999999%5D/q/" + queryItem_url_safe;
		if( this.productType == 'persona' )
			url = win.site_url + 'data/index/class/PersonaProducts/method/search/persona/' + queryItem_url_safe;
		
		Ti.API.info( url );
		
		this.xhr.open('GET', url, true);
		
		this.xhr.send();	
	},
	fillRows:function( responseText ){

		Ti.API.info( responseText );
	
		results = JSON.parse( responseText );
	
		Ti.API.info( 'Length: ' + results.length );
		
		for (var i=1;i<results.length;i++){

			// Display each of the top categories
			var row = Ti.UI.createTableViewRow({
				//title:results[i].title,
				//leftImage:'http://t3.gstatic.com/images?q=tbn:ANd9GcQidl6KX2jRWNeCA6jT_TjWG7NlI3aRiB_AcDsA9Y5owS2cr9G6',//results[i].img_medium,
				height:'100'
				//left:1
				//hasDetail:true
			});
			
			var rowImage = Titanium.UI.createImageView({
				image:results[i].img_medium,
				canScale:true,
				//right:225
				right:Ti.Platform.displayCaps.platformWidth * 0.7
			});
			row.add(rowImage);
			
			var rowPrice = Ti.UI.createLabel({
				text:results[i].price,
				font:{fontSize:15},
				color:'black',
				left:Ti.Platform.displayCaps.platformWidth * 0.3,
				top:5,
				height:'auto',
				//right:5
			});
			row.add(rowPrice);
			
			var rowTitle = Ti.UI.createLabel({
				text:results[i].title,
				font:{fontSize:15},
				color:'black',
				left:Ti.Platform.displayCaps.platformWidth * 0.3,
				top:25,
				height:'auto',
				//right:5
			});
			row.add(rowTitle);
			
			row.item_url = results[i].item_url;
	
			this.tableview.appendRow( row );
		}
		
		// Put a default row to let the user there is no results
		if( results.length == 0 ){
			Ti.API.info( 'No results' );
			
			var tableData = [];
			
			tableData.push( {title:"Sorry we did not find any",item_url:'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0%3FSubscriptionId%3DAKIAJO6OOIFG3LCMZPGA%26tag%3Dwedvite-20%26linkCode%3Dsp1%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB004HFS6Z0',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'}, {title:"recommendations for",item_url:'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0%3FSubscriptionId%3DAKIAJO6OOIFG3LCMZPGA%26tag%3Dwedvite-20%26linkCode%3Dsp1%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB004HFS6Z0',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'}, {title:"this friend",item_url:'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0%3FSubscriptionId%3DAKIAJO6OOIFG3LCMZPGA%26tag%3Dwedvite-20%26linkCode%3Dsp1%26camp%3D2025%26creative%3D165953%26creativeASIN%3DB004HFS6Z0',font:{fontFamily:'Helvetica Neue',fontSize:30,fontWeight:'bold'},color:'black'} );
		
			this.tableview.data = tableData;
		}
		
		/////////////////////////////////////////////////
		// Event Listener for the row click
		/////////////////////////////////////////////////
		this.tableview.addEventListener('click', function(e){
		
			if( ! SearchResults.testDidShow ){ // Delete me when this problem is figured out!!
			
				SearchResults.testDidShow = true;
					
				Ti.API.info( 'in tableview click event listener: ' + e.row.item_url  );
				
				//win.windowProductWebView.DetailPageURL = e.row.item_url;
				//windowProductWebView.backWindow = win;
				//win.windowProductWebView.open();
				//win.hide();
				
				SearchResults.hide();
				
				//returnDisplay = ProductWebView( e.row.btnBack, e.row.item_url );
				
				ProductWebView.DetailPageURL = e.row.item_url;
				ProductWebView.main();
			}
			
		});
	}
};