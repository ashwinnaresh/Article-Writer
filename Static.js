xhr = new XMLHttpRequest();
content_array = [""];
updated_tile_count = 4;

function init()
{
	document.body.style.backgroundImage = "url('images/bg1.png')";
	ta = document.getElementById("editor");
	ta.style.position = "fixed";
	ta.style.frameborder="0";
	ta.width = window.innerWidth/2+"px";

	//get editor
	editor = iframeRef(document.getElementById("editor"));

	//Setup the page
	// = this;
	tilediv = document.getElementById("mycontainer");
	tilediv.style.overflowY = "auto";
	tilediv.style.position = "absolute";
	tilediv.style.left = window.innerWidth/2+10+"px";
	tilediv.style.width = window.innerWidth/2+"px";

	tilecolors = ["amber","blue","brown","cobalt","crimson","cyan","emerald","green","indigo","lime","magenta","mango","mauve","orange","olive","pink","purple","violet","red","sienna","steel","teal","yellow","black"]

	attrList = ["","","","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile"];


	createVideoTile();
	createImageTiles();
	staticTiles();
	// for(t=11;t<18;t++)
	// {
	// 	DynamicTiles(t,["HI","HELLO","WORLD"]);
	// }

	setTimeout(getContents,10000);
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

function updateTiles(i,content_array,url_array)
{
	if(i<11)
	{
		div = document.getElementById("tile"+i);
		for(var k=0;k<content_array.length;k++)
		{
			cdiv = document.createElement("div");
			cdiv.innerHTML = content_array[k];
			cdiv.setAttribute("url",url_array[k]);
			cdiv.addEventListener("click",function(){
				var newtab = window.open(tile.getAttribute("url"), '_blank'); 
				newtab.focus();
			},false);
			div.appendChild(cdiv);
		}
		div.style.overflowY = "auto";
		animate();
	}
	else
	{
		DynamicTiles(i,content_array,url_array);
	}
}

function DynamicTiles(t,content_array,url_array)
{
	//Create tiles dynamically
	attrList.push("live-tile");
	addTile(t,content_array,url_array);
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
	// div.setAttribute("url","#");
	randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
	div.setAttribute("class",attrList[i]+" accent "+randColor);
	span = document.createElement("span");
	span.setAttribute("class","tile-title");
	
	span.innerHTML = "tile"+tile_no;
	div.appendChild(span);		

	for(var k=0;k<content.length;k++)
	{
		cdiv = document.createElement("div");
		cdiv.innerHTML = content[k];
		cdiv.setAttribute("url",urls[k]);
		cdiv.addEventListener("click",function(){
				var newtab = window.open(tile.getAttribute("url"), '_blank'); 
				newtab.focus();
			},false);
		div.appendChild(cdiv);
	}

	tilediv.appendChild(div);
	animate();
}


function iframeRef(frameRef) 
{
	return frameRef.contentWindow; //? frameRef.contentWindow.document : frameRef.contentDocument
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
