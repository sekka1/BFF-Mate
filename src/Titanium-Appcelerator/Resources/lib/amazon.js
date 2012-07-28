/*
Amazon Result Parsing

-This set of function will parse out the Amazon result set for specific values

-For different product results some array spots might not be there.  This set of
 functions will test it and return one that is there or some default value

*/

function amazonGetTitle( aResult ){
// Will return the Title of this product
//
// Input: one array spot from the Amazon result set - One product

	var title = aResult.ItemAttributes.Title
	
	return title;
}

function amazonGetPrice( aResult ){
// Will return the price of this product
//
// Input: one array spot from the Amazon result set - One product

	var price = 'none';

	// Check if the ListPrice associative array is there.  Sometime it might not be there
	if( aResult.ItemAttributes.ListPrice !== undefined ){

		Ti.API.info( 'ListPrice exist' );

		price = aResult.ItemAttributes.ListPrice.FormattedPrice;
	} 
	else if( aResult.OfferSummary !== undefined ){
	
		Ti.API.info( 'OfferSummary exist' );
		
		price = aResult.OfferSummary.LowestNewPrice.FormattedPrice;
	}

	return price;
}

function amazonGetImage( aResult ){
// Will return the image of this product
//
// Input: one array spot from the Amazon result set - One product

	var image = 'none';
	
	// Check if the SmallImage associative array is there.  Sometime it might not be there
	if( aResult.SmallImage !== undefined ){

		Ti.API.info( 'SmallImage exist' );

		image = aResult.SmallImage.URL;
	}

	return image;
}