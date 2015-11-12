<?php
	require_once 'alchemyapi.php';
	$alchemyapi = new AlchemyAPI();
	extract($_GET);
	$url = rawurldecode($url);

	$response = $alchemyapi->text('url', $url, null);

	if ($response['status'] == 'OK') {
	echo $response['text'];
	} 
	else {
	echo 'Error in the text extraction call: ', $response['statusInfo'];
	}

