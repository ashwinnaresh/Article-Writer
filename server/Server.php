<?php

require_once 'alchemyapi.php';

$alchemyapi = new AlchemyAPI();

// Keyword extraction
extract($_GET);
$res_arr = array();
$more_res = array();
$keywords = array();
$text = rawurldecode($demo_text);
$file_searched = fopen("search_terms.txt","a+");
$size = filesize("search_terms.txt");
if($size == 0)
	$searched = array();
else
{
	$searched = fread($file_searched,filesize("search_terms.txt"));
	$searched = explode(";", $searched);
}
// $text = "Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence. Machine learning explores the study and construction of algorithms that can learn from and make predictions on data.";

$response = $alchemyapi->keywords('text',$text, array('maxRetrieve'=>2));
if ($response['status'] == 'OK') 
{
	$words = '';
	foreach ($response['keywords'] as $keyword) 
	{
		//$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
			$words = $words . ';' . $keyword['text'] . ':' . $keyword['relevance'];
			$keywords[$keyword['text']]=$keyword['relevance'];
	}
} 
else 
{
	echo 'Error in the keyword extraction call: ', $response['statusInfo'];
}
// $keywords = array('computational learning theory'=> '0.971245',
// 					'pattern recognition'=> '0.854866',
// 					'artificial intelligence'=> '0.793011',
// 					'Machine learning' => '0.714784',
// 					'subfield'=> '0.638192');
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
	if(!in_array($word, $searched))
	{
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
	// array_push($res_arr,$search_res);
	//Create json for each search result
	for($i=0;$i<5;$i++)
	{
		foreach ($search_res[$i] as $inner => $v) 
		{
			if($inner == 'Url')
			{
				$res_inner_arr[] = array('Description' => $search_res[$i]['Description'],'Url' => $v );
			}	
		}	
	}
	$more_res_inner_arr = array();
	for($i=5;$i<10;$i++)
	{
		foreach ($search_res[$i] as $inner => $v) 
		{
			if($inner == 'Url')
			{
				$more_res_inner_arr[] = array('Description' => $search_res[$i]['Description'],'Url' => $v );
			}	
		}	
	}
	//Final results
	$more_res[] = array('search_term' => $word, 'results' => $more_res_inner_arr);
	$res_arr[] = array('search_term' => $word, 'results' => $res_inner_arr);
	fwrite($file_searched, $word.";");
}
}

if($concept != "empty")
{
	//$concept ="Machine Learning";
	if(!array_key_exists($concept, $keywords) && !in_array($concept, $searched))
	{
		//Search for each keyword
		$keyword = "" . $concept;
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
					$res_inner_arr[] = array('Description' => $search_res[$i]['Description'],'Url' => $v );
    			}	
			}	
		}
		$more_res_inner_arr = array();
		for($i=5;$i<10;$i++)
		{
			foreach ($search_res[$i] as $inner => $v) 
			{
				if($inner == 'Url')
				{
						$more_res_inner_arr[] = array('Description' => $search_res[$i]['Description'],'Url' => $v );
	    		}	
			}	
		}
		//Final results
		$more_res[] = array('search_term' => $concept, 'results' => $more_res_inner_arr);
		$res_arr[] = array('search_term' => $concept, 'results' => $res_inner_arr);
		fwrite($file_searched, $concept.";");
	}

}
fclose($file_searched);
$file = fopen("more_results.json","w");
fwrite($file,json_encode($more_res));
fclose($file);
echo json_encode($res_arr);
?>