<?php
//require_once 'C:\wamp\www\Article-Writer\unirest-php\src\Unirest.php';
require_once 'alchemyapi.php';
require_once("aylien_textapi_php-master/src/AYLIEN/TextAPI.php");
$alchemyapi = new AlchemyAPI();
$textapi = new AYLIEN\TextAPI("a6379b0a", "6f2cf6012da38962a60079bb4b7cea9c",false);
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
	//echo gettype($response);
	$arr=json_decode($response,true);
	$res_arr=array();
	$search_res = $arr['d']['results'];//['Description'];
	for($i=0;$i<5;$i++) {
		foreach ($search_res[$i] as $inner => $v) {
			if($inner == 'Url'){ 
				// //echo $inner.' '.$v;
				//  $text_data = $alchemyapi->text('url',$v,null);
				//  //echo $text_data['text'];
				$text_data='';
				$summary = $textapi->Summarize(array('url' => $v, 'sentences_number' => 5));
				foreach ($summary->sentences as $sentece) {
    					$text_data=$text_data.' '.$sentece;
    				}

     			$res_arr[] = array('Description' => $text_data,'Url' => $v );

    		}	
		}
	}
	echo json_encode($res_arr);//$res_arr;
}

else
{
	//both keywords + concepts search
}

?>