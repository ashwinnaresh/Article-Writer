<?php
	require_once 'alchemyapi.php';
	$alchemyapi = new AlchemyAPI();
	extract($_GET);
	$res_arr=array();
	$text = rawurldecode($demo_text);
	//echo $text;
	//$text_arr = explode(" ",$text);
	$response = $alchemyapi->concepts('text',$text,array('maxRetrieve'=>2));
	if ($response['status'] == 'OK') 
	{
		$con = array();
		// if(isset($response['concepts']))
		// 	echo "set";
		// echo json_encode($response);
		foreach ($response['concepts'] as $concept) 
		{
				//array_push($concepts, $concept['text']);

				$con[$concept['text']] = $concept['relevance'];
				// echo $concept['relevance'];
		}
	} 
	else 
	{
		echo 'Error in the concept tagging call: ', $response['statusInfo'];
	}
	// $con = array('computational learning theory'=> '0.971245',
	// 				'Computer'=> '0.854866',
	// 				'artificial intelligence'=> '0.793011',
	// 				'Machine learning' => '0.714784',
	// 				'subfield'=> '0.638192');
	arsort($con);
	$concept = array_keys($con)[0];
	// echo $concept;
	// $text = "Machine learning is a subfield of computer science that evolved from the study of pattern recognition and computational learning theory in artificial intelligence. Machine learning explores the study and construction of algorithms that can learn from and make predictions on data.";
	$acctKey = 'diiEv1nuNsNkXv7jMSuE+RmiBC7UXj+Nl0rCjj+3gVI=';
	$rootUri = 'https://api.datamarket.azure.com/Bing/Search/';
	$market = urlencode("'en-us'");
	$serviceOp = 'Composite';
	$query = rawurlencode("'$concept'");
	$sources = rawurlencode("'image+video'");
	$requestUri = "$rootUri/$serviceOp?\$format=json&Sources=$sources&Query=$query&Market=$market";
	// echo $requestUri;
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
	// echo $response;
	$arr = json_decode($response,true);
	$search_res = $arr['d']['results'];
	// echo $search_res[0]['Image'][0]['MediaUrl'];
	$res_inner_arr = array(
			'img' => array(),
			'src' => array(),
			'video' => $search_res[0]['Video'][0]['MediaUrl']
		);
	for($i = 0; $i < 10; $i++) 
	{
		array_push($res_inner_arr['img'], $search_res[0]['Image'][$i]['MediaUrl']);
		array_push($res_inner_arr['src'], $search_res[0]['Image'][$i]['SourceUrl']);
	}

	$res_arr[] = array('search_term' => $concept, 'results' => $res_inner_arr);
	echo json_encode($res_arr);
	// echo gettype($response);
?>