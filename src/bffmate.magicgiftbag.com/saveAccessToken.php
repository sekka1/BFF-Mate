<?php

if( isset( $_GET["access_token"] ) && isset( $_GET["user_id"] ) ){

	$access_token = $_GET["access_token"];
	$user_id = $_GET["user_id"];

	// Connect
	$m = new Mongo("mongodb://root:stackmob@ds031597.mongolab.com:31597/bffmate");

	// Select a database
	//$db = $m->harvest_access_tokens;

	// select a collection (analogous to a relational database's table)
	$collection = $m->bffmate->harvest_access_tokens;

	// Check if access token exsit
	$query = array( 'access_token' => $access_token );
	$cursor = $collection->find($query);
	$doesAccessTokenExist = false;

	foreach ($cursor as $obj) {
		$doesAccessTokenExist = true;
	}

	if( ! $doesAccessTokenExist ){
		$obj = array( "user_id" => $user_id, "access_token" => $access_token, "didPullData" => false );
		$collection->insert($obj);
	}

	//$cursor = $collection->find();

// iterate through the results
//foreach ($cursor as $obj) {
//    echo $obj["user_id"] . "\n";
//}

}


?>
