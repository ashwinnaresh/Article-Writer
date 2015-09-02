<?php
/**
   Copyright 2013 AlchemyAPI

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


	require_once('alchemyapi.php');
	$alchemyapi = new AlchemyAPI();


	$test_text = 'Bob broke my heart, and then made up this silly sentence to test the PHP SDK';  
	$test_html = '<html><head><title>The best SDK Test | AlchemyAPI</title></head><body><h1>Hello World!</h1><p>My favorite language is PHP</p></body></html>';
	$test_url = 'http://www.nytimes.com/2013/07/13/us/politics/a-day-of-friction-notable-even-for-a-fractious-congress.html?_r=0';
	$imageName = "grumpy-cat-meme-hmmm.jpg";
	$imageFile = fopen($imageName, "r") or die("Unable to open file!");
	$imageData = fread($imageFile,filesize($imageName));
	fclose($imageFile);

	//image keywords
	echo 'Checking image keywords . . . ', PHP_EOL;
	$response = $alchemyapi->image_keywords('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->image_keywords('image', $imageData, array('imagePostMode'=>'raw'));
	assert($response['status'] == 'OK');
	$response = $alchemyapi->image_keywords('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Image keyword tests complete!', PHP_EOL, PHP_EOL;

	//image extraction
	echo 'Checking image extraction . . . ', PHP_EOL;
	$response = $alchemyapi->imageExtraction('url',$test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->imageExtraction('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Image extraction tests complete!', PHP_EOL, PHP_EOL;

	//taxonomy
	echo 'Checking Taxonomy . . . ', PHP_EOL;
	$response = $alchemyapi->taxonomy('text',$test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->taxonomy('random', $test_text, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Taxonomy tests complete!', PHP_EOL, PHP_EOL;

	//combined
	echo 'Checking Combined . . . ', PHP_EOL;
	$response = $alchemyapi->combined('text',$test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->combined('random', $test_text, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Combined tests complete!', PHP_EOL, PHP_EOL;

	//Entities
	echo 'Checking entities . . . ', PHP_EOL;
	$response = $alchemyapi->entities('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->entities('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->entities('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->entities('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Entity tests complete!', PHP_EOL, PHP_EOL;


	//Keywords
	echo 'Checking keywords . . . ', PHP_EOL;
	$response = $alchemyapi->keywords('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->keywords('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->keywords('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->keywords('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Keyword tests complete!', PHP_EOL, PHP_EOL;


	//Concepts
	echo 'Checking concepts . . . ', PHP_EOL;
	$response = $alchemyapi->concepts('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->concepts('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->concepts('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->concepts('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Concept tests complete!', PHP_EOL, PHP_EOL;


	//Sentiment
	echo 'Checking sentiment . . . ', PHP_EOL;
	$response = $alchemyapi->sentiment('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Sentiment tests complete!', PHP_EOL, PHP_EOL;


	//Sentiment Targeted
	echo 'Checking targeted sentiment . . . ', PHP_EOL;
	$response = $alchemyapi->sentiment_targeted('text', $test_text, 'heart', null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment_targeted('html', $test_html, 'language', null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment_targeted('url', $test_url, 'Congress', null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->sentiment_targeted('random', $test_url, 'Congress', null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	$response = $alchemyapi->sentiment_targeted('text', $test_text, null, null);
	assert($response['status'] == 'ERROR');	//missing target
	echo 'Targeted sentiment tests complete!', PHP_EOL, PHP_EOL;


	//Text
	echo 'Checking clean text . . . ', PHP_EOL;
	$response = $alchemyapi->text('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //text only works on html and url content
	$response = $alchemyapi->text('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->text('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Clean text tests complete!', PHP_EOL, PHP_EOL;


	//Text Raw
	echo 'Checking raw text . . . ', PHP_EOL;
	$response = $alchemyapi->text_raw('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //text_raw only works on html and url content
	$response = $alchemyapi->text_raw('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->text_raw('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Raw text tests complete!', PHP_EOL, PHP_EOL;


	//Author
	echo 'Checking author . . . ', PHP_EOL;
	$response = $alchemyapi->author('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //author only works on html and url content
	$response = $alchemyapi->author('html', $test_html, null);
	assert($response['status'] == 'ERROR'); //there is no author listed in the test HTML content
	$response = $alchemyapi->author('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Author tests complete!', PHP_EOL, PHP_EOL;


	//Language
	echo 'Checking language . . . ', PHP_EOL;
	$response = $alchemyapi->language('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->language('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->language('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->language('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Language tests complete!', PHP_EOL, PHP_EOL;

	
	//Title
	echo 'Checking title . . . ', PHP_EOL;
	$response = $alchemyapi->title('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //title only works on html and url content
	$response = $alchemyapi->title('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->title('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Title tests complete!', PHP_EOL, PHP_EOL;

	
	//Relations
	echo 'Checking relations . . . ', PHP_EOL;
	$response = $alchemyapi->relations('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->relations('html', $test_html, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->relations('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->relations('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Relations tests complete!', PHP_EOL, PHP_EOL;

	
	//Category
	echo 'Checking category . . . ', PHP_EOL;
	$response = $alchemyapi->category('text', $test_text, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->category('html', $test_html, array('url'=>'test'));
	assert($response['status'] == 'OK');	
	$response = $alchemyapi->category('url', $test_url, null);
	assert($response['status'] == 'OK');
	$response = $alchemyapi->category('random', $test_url, null);
	assert($response['status'] == 'ERROR');	//invalid flavor
	echo 'Category tests complete!', PHP_EOL, PHP_EOL;

	
	//Feeds
	echo 'Checking feeds . . . ', PHP_EOL;
	$response = $alchemyapi->feeds('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //feeds only works on html and url content
	$response = $alchemyapi->feeds('html', $test_html, array('url'=>'test'));
	assert($response['status'] == 'OK');
	$response = $alchemyapi->feeds('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Feed tests complete!', PHP_EOL, PHP_EOL;

	
	//Microformats
	echo 'Checking microformats . . . ', PHP_EOL;
	$response = $alchemyapi->microformats('text', $test_text, null);
	assert($response['status'] == 'ERROR'); //microformats only works on html and url content
	$response = $alchemyapi->microformats('html', $test_html, array('url'=>'test'));
	assert($response['status'] == 'OK');
	$response = $alchemyapi->microformats('url', $test_url, null);
	assert($response['status'] == 'OK');
	echo 'Microformat tests complete!', PHP_EOL, PHP_EOL;

	echo '**** All tests are complete! ****', PHP_EOL;
?>
