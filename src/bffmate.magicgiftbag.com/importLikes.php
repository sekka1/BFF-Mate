<?php
	
	
	function importLikes($access_token)
	{

		set_time_limit(0);
		$return = array(
				'friends'=>0,
				'likes'=>0
		);
		
	
	
		if(empty($access_token)) die('please specify an access token');
		
		//$m = new Mongo("mongodb://bffmate:st4ckm0b@ds031597.mongolab.com:31597");
		$m = new Mongo("mongodb://root:stackmob@ds031597.mongolab.com:31597/bffmate");
		//$m = new Mongo("mongodb://localhost");
		$collection = $m->bffmate->likes;
		
		$friends = getMyFriends($access_token);
		
		$return['friends']=count($friends[0]);
		
		
		foreach($friends[0] as $aFriend){
			
			$likes = getFriendLikes($aFriend, $access_token);
			
			$return['likes'] += count($likes);
			
			foreach($likes as $like){
				//print_r($like);
				//$r = $collection->insert($like);
				//print_r($r);
				///*
				$collection->update(
					$criteria = array('id'=>$like['id'],'user_id'=>$like['user_id']), 
					$new_object=$like, 
					$options = array('upsert'=>true) 
				);
				//*/
			}
		}
		
	
		echo json_encode($return);
	
	}
	
	
	function getMyFriends($access_token)
	{
		$allFriends = array();
		$stillMoreFriends = true;
		$url = 'https://graph.facebook.com/me/friends?access_token=';
		$url .= $access_token;
	
	
		while( $stillMoreFriends ){
	
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			$results = curl_exec($ch);
			if( $results )
				$returnVal = $results;
			else
				$returnVal = curl_error($ch);
	
			//die(print_r($returnVal));
	
			$friends_array = json_decode( $results, true );
			foreach( $friends_array as $aFriend ){
				array_push( $allFriends, $aFriend );
			}
	
			//print_r( $friends_array['paging'] );
	
			if( isset( $friends_array['paging'] ) ){
				if( isset( $friends_array['paging']['next'] ) ){
					// Ther are more friends in the list. Go get them
	
					$url = $friends_array['paging']['next'];
				}else{
					$stillMoreFriends = false;
				}
			}
		}
		return $allFriends;
	}
	
	
	
	function getFriendLikes($aFriend, $access_token)
	{
		//die(var_dump($aFriend));
		$likes = array();
		$user_id = $aFriend['id'];
		$name = $aFriend['name'];
		//echo 'finding likes for '.$name."\n";
		$url = 'https://graph.facebook.com/'.$user_id.'/likes?access_token='.$access_token;
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$results = curl_exec($ch);
		
		$likes_array = json_decode( $results, true );
		//echo $likes_array;
		// Put this user's id into the like array
		if(!empty($likes_array['data'])){
		foreach( $likes_array['data'] as $aLike ){
			$aLike['name']=str_replace(array(':','-','!','?',','),'',utf8_encode($aLike['name']));
			$aLike['user_id'] = $user_id;
			$aLike['user_name'] = $name;
			array_push( $likes, $aLike );
		}
		}
		return $likes;
	}
	
	

?>
