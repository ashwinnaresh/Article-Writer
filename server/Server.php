<?php
//require_once 'C:\wamp\www\Article-Writer\unirest-php\src\Unirest.php';
require_once 'alchemyapi.php';
require_once("aylien_textapi_php/src/AYLIEN/TextAPI.php");
$alchemyapi = new AlchemyAPI();
// $textapi = new AYLIEN\TextAPI("a6379b0a", "6f2cf6012da38962a60079bb4b7cea9c",false);
// Keyword extraction
extract($_GET);
$res_arr=array();
$thresh_text = 50;
$keywords = array();
$text = rawurldecode($demo_text);
$text = "Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence. Machine learning explores the study and construction of algorithms that can learn from and make predictions on data.";
$text_arr = explode(" ",$text);
$word_count = count($text_arr);
// $response = $alchemyapi->keywords('text',$text, array('maxRetrieve'=>2));
// if ($response['status'] == 'OK') 
// {
// 	$words = '';
// 	foreach ($response['keywords'] as $keyword) 
// 	{
// 		//$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
// 		if($keyword['relevance'] >= $threshold)
// 		{
// 			$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
// 			$keywords[$keyword['text']]=$keyword['relevance'];
// 		}
// 	}
// } 
// else 
// {
// 	echo 'Error in the keyword extraction call: ', $response['statusInfo'];
// }
$keywords = array('computational learning theory'=> '0.971245',
					'pattern recognition'=> '0.854866',
					'artificial intelligence'=> '0.793011',
					'Machine learning' => '0.714784',
					'subfield'=> '0.638192');
	 arsort($keywords);
// Algorithm for picking top keywords and concepts and performing a search 
// For 50 words or lesser, perform a search based on the keywords, otherwise, search based on words
// common to keywords and concepts (? might need to be changed)

	$acctKey = 'diiEv1nuNsNkXv7jMSuE+RmiBC7UXj+Nl0rCjj+3gVI=';
	$rootUri = 'https://api.datamarket.azure.com/Bing/Search';
	$market = urlencode("'en-us'");
	$serviceOp = 'Web';
	$limit = 0;
	//search only keywords
	foreach ($keywords as $word => $relevance) 
	{
	//Search for each keyword
	$keyword = "" . $word;
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
	$res_inner_arr=array();
	$search_res = $arr['d']['results'];
	//Create json for each search result
	for($i=0;$i<5;$i++)
		{
			foreach ($search_res[$i] as $inner => $v) 
			{
				if($inner == 'Url')
				{
					//Dummy text as AYLIEN causing problems
					$text_data="'$limit'";
					$limit=$limit+1;
					//$summary = $textapi->Summarize(array('url' => $v, 'sentences_number' => 5));
					// foreach ($summary->sentences as $sentece) {
    						// $text_data=$text_data.' '.$sentece;
    					// }
    				if(strlen($text_data)>0)
    				{
     					$res_inner_arr[] = array('Description' => $text_data,'Url' => $v );
     				}
    			}	
			}	
		}
	//Final results
	$res_arr[] = array('search_term' => $word, 'results' => $res_inner_arr);
	}

if($word_count>=(int)$thresh_text)
{
	
//    $response = $alchemyapi->concepts('text',$text,array('maxRetrieve'=>2));
//  if ($response['status'] == 'OK') 
//  {
// 	$con = array();
// 	foreach ($response['concepts'] as $concept) 
// 	{
// 			//array_push($concepts, $concept['text']);
// 			$con[$concept['text']] = $concept['relevance'];
// 	}
// } 
// else 
// {
// 	echo 'Error in the concept tagging call: ', $response['statusInfo'];
// }
$con = array('computational learning theory'=> '0.971245',
					'Computer'=> '0.854866',
					'artificial intelligence'=> '0.793011',
					'Machine learning' => '0.714784',
					'subfield'=> '0.638192');
arsort($con);
	foreach ($con as $word => $relevance) 
	{
	if(!array_key_exists($word, $keywords))
	{
	//Search for each keyword
	$keyword = "" . $word;
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
	$res_inner_arr=array();
	$search_res = $arr['d']['results'];
	//Create json for each search result
	for($i=0;$i<5;$i++)
		{
			foreach ($search_res[$i] as $inner => $v) 
			{
				if($inner == 'Url')
				{
					//Dummy text as AYLIEN causing problems
					$text_data="'$limit'";
					$limit=$limit+1;
					//$summary = $textapi->Summarize(array('url' => $v, 'sentences_number' => 5));
					// foreach ($summary->sentences as $sentece) {
    						// $text_data=$text_data.' '.$sentece;
    					// }
    				if(strlen($text_data)>0)
    				{
     					$res_inner_arr[] = array('Description' => $text_data,'Url' => $v );
     				}
    			}	
			}	
		}
		$res_arr[] = array('search_term' => $word, 'results' => $res_inner_arr);
	}
}
}
echo json_encode($res_arr);
?>