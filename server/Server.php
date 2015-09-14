<?php
require_once 'alchemyapi.php';
$alchemyapi = new AlchemyAPI();

// Keyword extraction
extract($_GET);
$response = $alchemyapi->keywords('text',rawurldecode($demo_text), array('maxRetrieve'=>5));
if ($response['status'] == 'OK') 
{
	$words='';
	foreach ($response['keywords'] as $keyword) 
	{
		$words=$words.';'.$keyword['text'].':'.$keyword['relevance'];
	}
	echo $words;
} 
else 
{
	echo 'Error in the keyword extraction call: ', $response['statusInfo'];
}

$response = $alchemyapi->concepts('text',rawurldecode($demo_text), null);
if ($response['status'] == 'OK') 
{
	$con='';
	foreach ($response['concepts'] as $concept) {
		$con=$con.';'.$concept['text'].':'.$concept['relevance'];
	}
	echo $con;
} 
else 
{
	echo 'Error in the concept tagging call: ', $response['statusInfo'];
}
?>