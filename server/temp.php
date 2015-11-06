<?php
require_once 'alchemyapi.php';

$alchemyapi = new AlchemyAPI();
$text = "Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence. Machine learning explores the study and construction of algorithms that can learn from and make predictions on data.";
$response = $alchemyapi->keywords('text',$text, array('maxRetrieve'=>2));
if ($response['status'] == 'OK') 
{
	$words = '';
	foreach ($response['keywords'] as $keyword) 
	{
		//$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
			$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
			echo $words."<br>";
			$keywords[$keyword['text']]=$keyword['relevance'];
	}
} 
else
{
	echo $response['statusInfo']."<br>";
}