<?php
	$file = fopen("mediaServer.json","r");
	$str = fgets($file);
	echo $str;
	fclose($file);
	$arr = json_decode($str);
	echo $arr;
?>