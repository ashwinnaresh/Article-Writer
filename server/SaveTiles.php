<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	$request_body = file_get_contents('php://input');
	$json = json_decode($request_body);

	file_put_contents('tiles.json', json_encode($json));
	echo "Saved to server";
}
else
{
	$json = json_decode(file_get_contents('tiles.json'));
	echo json_encode($json);
}

?>