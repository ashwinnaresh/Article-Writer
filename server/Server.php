<?php
require_once 'alchemyapi.php';
$alchemyapi = new AlchemyAPI();

// Keyword extraction
extract($_GET);
$demo_text = "The 20 newsgroups dataset is a collection of approximately 20,000 newsgroup documents, partitioned (nearly) evenly across 20 different newsgroups. The 20 newsgroups collection has become a popular data set for experiments in text applications of machine learning techniques, such as text classification and text clustering. We will use the Mahout CBayes classifier to create a model that would classify a new document into one of the 20 newsgroups.";
$response = $alchemyapi->keywords('text',rawurldecode($demo_text), array('maxRetrieve'=>5));
if ($response['status'] == 'OK') 
{
	$words='';
	foreach ($response['keywords'] as $keyword) 
	{
		$words=$words.';'.$keyword['text'].':'.$keyword['relevance'];
	}
	echo "KEYWORDS=".$words."\n";
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
	echo "CONCEPT=".$con;
} 
else 
{
	echo 'Error in the concept tagging call: ', $response['statusInfo'];
}
?>