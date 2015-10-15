<?php
	extract($_GET);
	$res_arr = array();
	$acctKey = 'diiEv1nuNsNkXv7jMSuE+RmiBC7UXj+Nl0rCjj+3gVI=';
	$rootUri = 'https://api.datamarket.azure.com/Bing/Search';
	$market = urlencode("'en-us'");
	$serviceOp = 'Web';
	$keyword = "" . $search_text;
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
	$res_arr[] = array('search_term' => $search_text, 'results' => $res_inner_arr);

	echo json_encode($res_arr);
?>