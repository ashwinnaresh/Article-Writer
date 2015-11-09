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
	for(var i=1;i<tiles.length;i++)
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
	// tiles_obj = { [{text,url},{text,url},{text,url},{text,url},{text,url}] , [{text,url},{text,url},{text,url},{text,url},{text,url}] }
	

	// POST CALL TO SAVE TO SERVER
	$.ajax({
    url: 'http://localhost:8088/Article-Writer/server/SaveTiles.php',
    type: 'POST',
    data: JSON.stringify(tiles_obj),
    contentType: 'application/json; charset=utf-8',
    success: function(msg) {
        alert(msg);
    }
	});

	// GET CALL TO GET THE JSON
	$.ajax({
    url: 'http://localhost:8088/Article-Writer/server/SaveTiles.php',
    type: 'GET',
    success: function(msg) {
        var json = JSON.parse(msg);
       	for(k in json)
       	for(j in json[k])
       		for(i in json[k][j])
       			alert(json[k][j][i]);
    }
	});

}
