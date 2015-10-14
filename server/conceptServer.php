<?php
	require_once 'alchemyapi.php';
	$alchemyapi = new AlchemyAPI();
	extract($_GET);
	$text = rawurldecode($text);
	//echo $text;
	//$text_arr = explode(" ",$text);
	$response = $alchemyapi->concepts('text',$text,array('maxRetrieve'=>2));
	if ($response['status'] == 'OK') 
	{
		$con = array();
		// if(isset($response['concepts']))
		// 	echo "set";
		// echo json_encode($response);
		foreach ($response['concepts'] as $concept) 
		{
				//array_push($concepts, $concept['text']);

				$con[$concept['text']] = $concept['relevance'];
				// echo $concept['relevance'];
		}
	} 
	else 
	{
		echo 'Error in the concept tagging call: ', $response['statusInfo'];
	}
	arsort($con);
	reset($con);
	echo key($con);
?>