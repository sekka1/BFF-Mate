<?php

include_once( 'importLikes.php' );

// Connect
$m = new Mongo("mongodb://root:stackmob@ds031597.mongolab.com:31597/bffmate");

// select a collection (analogous to a relational database's table)
$collection = $m->bffmate->harvest_access_tokens;

$query = array( 'didPullData' => false );
$cursor = $collection->find($query)->limit(1);

// Update these records to true on didPullData, so that if the pulling takes more than a minute it wont pull these again
foreach ($cursor as $obj) {

	$newData = array( 'user_id' => $obj["user_id"], 'access_token' => $obj["access_token"], 'didPullData' => true );

	$criteria = array( 'user_id' => $obj["user_id"] );

	$collection->update($criteria, $newData);

	echo $obj["user_id"] . "\n";

	importLikes( $obj["access_token"] );
}
/*
$cursor->rewind();

// iterate through the results and harvest just these two
foreach ($cursor as $obj) {
    echo $obj["user_id"] . "\n";

	// Run getting friends data
	importLikes( $obj["access_token"] );

}
*/


?>
