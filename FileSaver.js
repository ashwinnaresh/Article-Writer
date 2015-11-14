function saveTextAsFile()
{
	var textToWrite = editor.getContent();
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
	document.getElementById("inputFileNameToSaveAs").value = "";

	saveTiles();
}

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function loadFileAsText()
{
	var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("inputTextToSave").value = textFromFileLoaded;
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}

function saveTiles()
{
	var tilediv = document.getElementById("mycontainer");
	var tiles = tilediv.childNodes;
	var tiles_obj = {};
	tiles_obj["tile1"] = document.getElementById("tile1").getAttribute("url");
	
	var img_tile1 = document.getElementById("tile2");
	var img_urls = [];
	for(var k=0;k<img_tile1.childNodes.length;k++)
	{
		img_urls.push(img_tile1.childNodes[k].firstChild.src);
	}
	tiles_obj["tile2"] = img_urls;

	var img_tile2 = document.getElementById("tile3");
	var img_urls = [];
	for(var k=0;k<img_tile2.childNodes.length;k++)
	{
		img_urls.push(img_tile2.childNodes[k].firstChild.src);
	}
	tiles_obj["tile3"] = img_urls;


	for(var i=4;i<tiles.length;i++)
	{
		var content = tiles[i].childNodes;
		var tile = new Array();
		for(var j=0;j<content.length;j++)
		{
			var url = content[j].getAttribute("url");
			var text = content[j].innerHTML;
			
			tile.push({
					"text" : text,
					"link" : url
					});
		}
		tiles_obj[tiles[i].id] = tile;
	}
	console.log(tiles_obj);
	// tiles_obj = { [{text,url},{text,url},{text,url},{text,url},{text,url}] , [{text,url},{text,url},{text,url},{text,url},{text,url}] }
	

	// POST CALL TO SAVE TO SERVER
	$.ajax({
    url: 'http://localhost/Article-Writer/server/SaveTiles.php',
    type: 'POST',
    data: JSON.stringify(tiles_obj),
    contentType: 'application/json; charset=utf-8',
    success: function(msg) {
        alert(msg);
    }
	});
}
