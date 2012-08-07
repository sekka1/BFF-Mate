<?php 


if(!empty($_REQUEST['c']))
{
	header('Content-Type: text/plain');
	$category = $_REQUEST['c'];
}
else if(!empty($_SERVER['argv'][1]))
{
	$category = $_SERVER['argv'][1];
}
else 
{
	$category = null;
}
	

if(!$category) die('no category specified');

switch($category){
	case 'Movie':
		$conditions = array('category'=>'Movie');
		break;
	case 'Conversation':
		$conditions = array('$or'=>array(

			array('category'=>'Travel/leisure'),
			array('category'=>'Magazine'),
			array('category'=>'Entertainer'),
			array('category'=>'Interest'),
			array('category'=>'Cars'),
			array('category'=>'Tv show'),
			array('category'=>'Athlete'),
			array('category'=>'Comedian'),
			array('category'=>'Field of study'),
			array('category'=>'Sport'),
			array('category'=>'Actor/director'),
			array('category'=>'Local/travel'),
			array('category'=>'Politician'),
			array('category'=>'Professional sports team'),
			));
		break;
	case "Food":
		$conditions = array('$or'=>array(
			array('category'=>'Restaurant/cafe'),
			array('category'=>'Food/beverages'),
		));
	break;		
	case "Books":
		$conditions = array('$or'=>array(
			array('category'=>'Author'),
			array('category'=>'Books'),
			array('category'=>'Writer'),
		));
	break;		

	case "Music":
		$conditions = array('$or'=>array(
			array('category'=>'Musician/band'),
		));
	break;		
	
	default:
		echo 'no category selected';
		die();
}


//$m = new Mongo("mongodb://localhost");
$m = new Mongo("mongodb://root:stackmob@ds031597.mongolab.com:31597/bffmate");
$collection = $m->bffmate->likes;

$r = $collection->find($conditions);
//print_r($r);
$text='user,item,pref'."\n";
foreach($r as $s){
	//print_r($s);
	$text .= "{$s['user_id']},{$s['name']},4 \n";
}
$fp = fopen("$category.txt", "w");
fwrite( $fp, $text);
fclose($fp);

//echo $text;

?>