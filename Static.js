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
	// DynamicTiles(11,["HI","HELLO","WORLD"],["https://www.google.com","https://www.youtube.com","https://www.facebook.com"]);
	// for(t=11;t<18;t++)
	// {
	// 	DynamicTiles(t,["HI","HELLO","WORLD"],["https://www.google.com","https://www.youtube.com","https://www.facebook.com"]);
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
	div.setAttribute("class","live-tile two-wide"+" accent "+randColor+" exclude");
	tilediv.appendChild(div);

	div = document.createElement("div");
	div.id = "tile3";
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class","live-tile two-wide"+" accent "+randColor+" exclude");
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
	

	for(var k=0;k<content.length;k++)
	{
		cdiv = document.createElement("div");
		cdiv.innerHTML = content[k];
		cdiv.setAttribute("url",urls[k]);
		cdiv.addEventListener("click",function(){
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

	//if already 11 tiles are replaced, start from first
	if(replace_count > 11)
		replace_count = 4;
	
	old_tile = document.getElementById("tile"+replace_count);
	new_tile = document.getElementById("tile"+tile_id);
	//swap the id's before replacing
	t = old_tile.id;
	old_tile.id = new_tile.id;
	new_tile.id = t;
	//put the new id's in the span
	old_tile.childNodes[0].innerHTML = old_tile.id;
	new_tile.childNodes[0].innerHTML = new_tile.id;
	
	// alert("old = "+old_tile.id+" new = "+new_tile.id);
	tilediv.replaceChild(new_tile,old_tile);
	tilediv.appendChild(old_tile);
	replace_count++;
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
        alert("Please enter a title!");
        getTitle();                              
      } else {

      	var pos = window.innerWidth/4;
      	editor.insertTitle(pos,result.toUpperCase());

			$.ajax({
		url:"http://localhost:8088/Article-Writer/server/searchServer.php?search_text="+result,
		type:"GET",
		success:function(data)
		{
			// alert("SUCCESS");
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