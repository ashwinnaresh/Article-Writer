xhr = new XMLHttpRequest();
content_array = [""];
updated_tile_count = 4;
replace_count = 4;

function init()
{
	//get editor
	editor = iframeRef(document.getElementById("editor"));

	getTitle();

	document.body.style.backgroundImage = "url('images/bg1.png')";
	ta = document.getElementById("editor");
	ta.style.position = "fixed";
	ta.style.frameborder="0";
	ta.width = window.innerWidth/2+"px";

	prev = "";
	dt = new Date();
	//Setup the page
	// = this;
	tilediv = document.getElementById("mycontainer");
	tilediv.style.overflowY = "auto";
	tilediv.style.position = "absolute";
	tilediv.style.left = window.innerWidth/2+10+"px";
	tilediv.style.width = window.innerWidth/2+"px";

	tilecolors = ["amber","blue","brown","cobalt","crimson","cyan","emerald","green","indigo","lime","magenta","mango","mauve","orange","olive","pink","purple","violet","red","sienna","steel","teal","yellow","black"]

	attrList = ["","","","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile"];


	createVideoTile();
	createImageTiles();
	staticTiles();
	//  for(t=4;t<12;t++)
	// 	updateTiles(t,["tile"+t,"tile"+t,"tile"+t],["https://www.google.com","https://www.youtube.com","https://www.facebook.com"],"tile"+t);
	
	// for(var t=11;t<19;t++)
	// {
	// 	// alert(t);
	// 	DynamicTiles(t,["tile"+(t+1),"tile"+(t+1),"tile"+(t+1)],["https://www.google.com","https://www.youtube.com","https://www.facebook.com"]);
	// }

	// for(var t=19;t<20;t++)
	// {
	// 	alert(t);
	// 	DynamicTiles(t,["tile"+(t+1),"tile"+(t+1),"tile"+(t+1)],["https://www.google.com","https://www.youtube.com","https://www.facebook.com"]);
	// }

	setTimeout(getContents,10000);
	setTimeout(getMediaContents,10000);
	setTimeout(checkContents,20000);
}

function animate()
{
	$(".live-tile").not(".exclude").liveTile();
	$( ".tiles" ).sortable();
	$( ".tiles" ).disableSelection();
}

function staticTiles()
{
	//Create tiles for each item in the initial list
	for(i=3;i<attrList.length;i++)
	{
		addTile(i,[],[]);
	}
}



function DynamicTiles(t,content_array,url_array)
{
	//Create tiles dynamically
	attrList.push("live-tile");
	addTile(t,content_array,url_array);
	manageTile(t+1);
}

		
function createImageTiles()
{
	div = document.createElement("div");
	div.id = "tile2";
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class","live-tile two-wide"+" accent "+randColor);
	tilediv.appendChild(div);

	div = document.createElement("div");
	div.id = "tile3";
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class","live-tile two-wide"+" accent "+randColor);
	tilediv.appendChild(div);

}


function createVideoTile()
{
	div = document.createElement("div");
	div.id = "tile1";
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class","live-tile two-wide two-tall"+" accent "+randColor+" exclude");
	tilediv.appendChild(div);
}



//Function to create a single tile. Takes the tile count and the content to be displayed in it.
function addTile(i,content,urls)
{
	div = document.createElement("div");
	tile_no = i+1;
	div.id = "tile"+tile_no;
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class",attrList[i]+" accent "+randColor);
	div.setAttribute("copy",false);

	div.oncontextmenu = function(event)
	{
		div.setAttribute("copy",true);
		editor.insertIntoEditor(editor.getContent().length+4,event.target.innerHTML);
		event.preventDefault();
	}

	for(var k=0;k<content.length;k++)
	{
		cdiv = document.createElement("div");
		cdiv.innerHTML = content[k];
		cdiv.setAttribute("url",urls[k]);
		cdiv.addEventListener("click",function(event){
				var newtab = window.open(cdiv.getAttribute("url"), '_blank'); 
				newtab.focus();
			},false);

		div.appendChild(cdiv);
	}
	tilediv.appendChild(div);
	animate();
}

function manageTile(tile_id)
{
	//code for retaining useful tiles and when to flush retained tiles to be added
	var status = document.getElementById("tile"+tile_id).getAttribute("copy");	// Whether user has right clicked on it
	if(tile_id >= 20)
	{
		// shift the tiles by 1 to make space for the new tile
		for(var i = 4; i < 20; i++)
		{
			old_tile = document.getElementById("tile"+(i+1));
			console.log(old_tile.innerHTML);
			if( i == 4) //for first content tile
				new_tile = document.getElementById("tile"+i);
			else
				new_tile = temp;
			console.log(new_tile.innerHTML);
			//swap the id's before replacing
			t = old_tile.id;
			old_tile.id = new_tile.id;
			new_tile.id = t;
			
			
			tilediv.replaceChild(new_tile,old_tile);
			if( i == 4)
			{
				new_tile.innerHTML = "helllo";
				new_tile.id = "tile4";
				tilediv.insertBefore(old_tile,new_tile);
			}
			temp = old_tile;
		}
		// replace the old tile4 with the newly added tile
		old_tile = document.getElementById("tile4");
		new_tile = document.getElementById("tile"+tile_id);
		//swap the id's before replacing
		t = old_tile.id;
		old_tile.id = new_tile.id;
		new_tile.id = t;
		
		

		tilediv.replaceChild(new_tile,old_tile);
	}
	else
	{
		//if already 11 tiles are replaced, start from first
		if(replace_count > 11)
			replace_count = 4;
		

		old_tile = document.getElementById("tile"+replace_count);
		alert(old_tile.id);
		new_tile = document.getElementById("tile"+tile_id);
		alert(new_tile.id);
		//swap the id's before replacing
		t = old_tile.id;
		old_tile.id = new_tile.id;
		new_tile.id = t;
		
		

		tilediv.replaceChild(new_tile,old_tile);
		tilediv.appendChild(old_tile);
		replace_count++;
	}
}

function iframeRef(frameRef) 
{
	return frameRef.contentWindow; //? frameRef.contentWindow.document : frameRef.contentDocument
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getTitle()
{
	$(document).ready(function(e) {
      bootbox.prompt("Enter a title / topic", function(result) {                
      if (result === null) {                                             
                             
      } else {

      	var pos = window.innerWidth/4;
      	editor.insertTitle(pos,result.toUpperCase());

			$.ajax({
		url:"http://localhost/Article-Writer/server/searchServer.php?search_text="+result,
		type:"GET",
		success:function(data)
		{

			// console.log("data type "+typeof(data));
			res = JSON.parse(data);
			// console.log("res[0]");
			// console.log(res[0]['results'][0]['Description']);
			//  console.log(res[1]['results'][1]['Description']);
			var count = 0;
			j=updated_tile_count;
			content_array = [];
			url_array = [];
			for(i=0;i<5;i++)
			{
				// content_array.push(data);
				// url_array.push("http://google.com");
				content_array.push(res[count]['results'][i]['Description']);
				url_array.push(res[count]['results'][i]['Url']);
				console.log("Desc : "+res[count]['results'][i]['Description']+" URL : "+res[count]['results'][i]['Url']);
				console.log("Search term : "+res[count]['search_term']);
			}
			updateTiles(j,content_array,url_array,res[count]['search_term']);
			updated_tile_count+=1;
		},
	});                          
      }
    });
    });
}

function openFromFile()
{
	document.getElementById('files').addEventListener('change', readFile, false);
	$("#files").click();
}
function readFile(evt)
{
	var files = evt.target.files; // FileList object
    for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();

		reader.onload = function(e) {
		  var text = reader.result;
		  editor.insertIntoEditor(0,text);
		}

		reader.readAsText(f);
    }

    restoreTiles();
}
function restoreTiles()
{
	// GET CALL TO GET THE JSON
	$.ajax({
    url: 'http://localhost/Article-Writer/server/SaveTiles.php',
    type: 'GET',
    success: function(msg) {
        var json = JSON.parse(msg);
        var container = document.getElementById("mycontainer");
        container.innerHTML = "";
        createVideoTile();
        createImageTiles();

        console.log(json);
        var tile_count = 3;

        updateVideoTile(json["tile1"]);
        delete json["tile1"];

        var img_arr1 = json["tile2"];
        var urls = [];
        for(var i=0;i<img_arr1.length;i++)
        {
        	urls.push(img_arr1[i]);
        }
        updateImages(2,urls,urls);

        var img_arr2 = json["tile3"];
        var urls = [];
        for(var i=0;i<img_arr2.length;i++)
        {
        	urls.push(img_arr2[i]);
        }
        updateImages(3,urls,urls);

        delete json["tile2"];
        delete json["tile3"];

       	for(k in json)
       	{
   			var content_arr = [];
   			var url_array = [];

       		if(json[k].length > 0)// Gives number of content divs of each tile
       		{
       			for(j in json[k])	//For each content div
	       		{
	       			content_arr.push(json[k][j].text);
	       			url_array.push(json[k][j].link);
	       		}
       		}
  			addTile(tile_count,content_arr,url_array);

  			tile_count++;
       	}
    }
	});
}