<?php
//require_once 'C:\wamp\www\Article-Writer\unirest-php\src\Unirest.php';
require_once 'alchemyapi.php';
$alchemyapi = new AlchemyAPI();

// Keyword extraction
extract($_GET);
$threshold = 0.65;
$keywords = array();
$concepts = array();
$text = rawurldecode($demo_text);
$count = count($text);
//$demo_text = "The 20 newsgroups dataset is a collection of approximately 20,000 newsgroup documents, partitioned (nearly) evenly across 20 different newsgroups. The 20 newsgroups collection has become a popular data set for experiments in text applications of machine learning techniques, such as text classification and text clustering. We will use the Mahout CBayes classifier to create a model that would classify a new document into one of the 20 newsgroups.";
$response = $alchemyapi->keywords('text',$text, array('maxRetrieve'=>5));
if ($response['status'] == 'OK') 
{
	$words = '';
	foreach ($response['keywords'] as $keyword) 
	{
		//$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
		if($keyword['relevance'] >= $threshold)
		{
			$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
			array_push($keywords, $keyword['text']);
		}
	}
	// echo "KEYWORDS = " . $words . "\n";
} 
else 
{
	echo 'Error in the keyword extraction call: ', $response['statusInfo'];
}

$response = $alchemyapi->concepts('text',rawurldecode($demo_text), null);
if ($response['status'] == 'OK') 
{
	$con = '';
	foreach ($response['concepts'] as $concept) 
	{
		// $con=$con . ';' . $concept['text'] . ':' . $concept['relevance'];
		if($concept['relevance'] >= $threshold)
		{
			array_push($concepts, $concept['text']);
			$con = $con . ';' . $concept['text'] . ':' . $concept['relevance'];
		}
	}
	// echo "CONCEPT = " . $con;
} 
else 
{
	echo 'Error in the concept tagging call: ', $response['statusInfo'];
}

// Algorithm for picking top keywords and concepts and performing a search 
// For 50 words or lesser, perform a search based on the keywords, otherwise, search based on words
// common to keywords and concepts (? might need to be changed)

$acctKey = 'diiEv1nuNsNkXv7jMSuE+RmiBC7UXj+Nl0rCjj+3gVI=';
$rootUri = 'https://api.datamarket.azure.com/Bing/Search';
$market = urlencode("'en-us'");
$serviceOp = 'Web';

if($count <= 50)
{
	//search only keywords
	$keyword = "" . $keywords[0];
	$query = rawurlencode("'$keyword'");
	$requestUri = "$rootUri/$serviceOp?\$format=json&Query=$query&Market=$market";
	// Encode the credentials and create the stream context.
	$auth = base64_encode("$acctKey:$acctKey");
	$data = array(
					'http' => array(
									'request_fulluri' => true,
									// ignore_errors can help debug – remove for production. This option added in PHP 5.2.10
									'ignore_errors' => true,
									'header' => "Authorization: Basic $auth"
									)
				);
	$context = stream_context_create($data);
	// Get the response from Bing.
	$response = file_get_contents($requestUri, 0, $context);
	//echo "hi";
	echo $response;
	/*$res=json_decode($response,true);
	echo $res['d']['results'][1]['Description'];
	$ch = curl_init("http://api.smmry.com/&SM_API_KEY=6232BCC290&SM_LENGTH=5&SM_URL=".$res['d']['results'][1]['Url']);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT,20);
	curl_setopt($ch, CURLOPT_TIMEOUT,20);
	$return = json_decode(curl_exec($ch), true);//You're summary is now stored in $return['sm_api_content'].
	echo $return['sm_api_content'];
	curl_close($ch);*/
	/*$response = Unirest\Request::post("https://textanalysis-text-summarization.p.mashape.com/text-summarizer",
  array(
    "X-Mashape-Key" => "3iMgVTFKtsmshtMCfYW5c865D3KKp1WVRpxjsnAizNDz1d23CV",
    "Content-Type" => "application/json",
    "Accept" => "application/json"
  ),
  "{\"url\":\"http://en.wikipedia.org/wiki/Automatic_summarization\",\"text\":\"\",\"sentnum\":8}"
);
	// Send the response back to the browser.
	//$response=(array)json_encode($response);
	echo $response->raw_body;
	//echo $response;
	// echo "" . $keywords[0];*/
}
else
{
	//both keywords + concepts search
}

?>