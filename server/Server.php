<?php
require_once 'alchemyapi.php';
$alchemyapi = new AlchemyAPI();

// Keyword extraction
$demo_text = "Now you can use the alchemyapi object to access any of AlchemyAPI's text analysis functions, just like the example.php file does. For example, to calculate the document sentiment for a simple sentence, try:";
$response = $alchemyapi->keywords('text',$demo_text, array('sentiment'=>1));
if ($response['status'] == 'OK') 
{
	echo '## Keywords ##', "<br>";
	foreach ($response['keywords'] as $keyword) 
	{
		echo 'keyword: ', $keyword['text'], "<br>";
		echo 'relevance: ', $keyword['relevance'], "<br>";
	}
} 
else 
{
	echo 'Error in the keyword extraction call: ', $response['statusInfo'];
}

$response = $alchemyapi->concepts('text',$demo_text, null);
if ($response['status'] == 'OK') 
{
	echo '## Concepts ##', "<br>";
	foreach ($response['concepts'] as $concept) {
		echo 'concept: ', $concept['text'], "<br>";
		echo 'relevance: ', $concept['relevance'], "<br>";
	}
} 
else 
{
	echo 'Error in the concept tagging call: ', $response['statusInfo'];
}
?>