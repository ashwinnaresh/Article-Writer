xhr = new XMLHttpRequest();
content_array = [""];

function init()
{
	document.body.style.backgroundImage = "url('images/bg1.png')";
	ta = document.getElementById("editor");
	ta.style.position = "fixed";
	ta.style.frameborder="0";
	ta.width = window.innerWidth/2+"px";

	//get editor
	editor = iframeRef(document.getElementById("editor"));

	//Start creating tiles	
	obj = new TileAction();

	setTimeout(getContents,10000);
}

function iframeRef(frameRef) 
{
	return frameRef.contentWindow; //? frameRef.contentWindow.document : frameRef.contentDocument
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getContents()
{
	content = editor.getContent();
	xhr.onreadystatechange = getResults;
	xhr.open("GET", "http://localhost:8088/Article-Writer/server/Server.php?demo_text=" + encodeURI(content), true);
	// xhr.send();

	setTimeout(getContents,20000);
}

function getResults()
{
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		res = JSON.parse(xhr.responseText);
		//alert(res[0]);
		for(i=1;i<=count;i++)
		{
			updateContent(i,res[i]['Description'],res[i]['Url']);
		}
	}
}


function updateContent(tile_id,content,url)
{
	tile = document.getElementById("tile"+tile_id);

	tile.addEventListener("click",function(){
		// alert(url);
		tile.setAttribute("url",url);
		newtab = window.open(tile.getAttribute("url"), '_blank'); 
		newtab.focus();
	},false);

	tile.style.overflowY = "auto";
	tile.innerHTML = content;
}

function TileAction()
{
	//Setup the page
	othis = this;
	othis.tilediv = document.getElementById("mycontainer");
	othis.tilediv.style.overflowY = "auto";
	othis.tilediv.style.position = "absolute";
	othis.tilediv.style.left = window.innerWidth/2+10+"px";
	othis.tilediv.style.width = window.innerWidth/2+"px";

	tilecolors = ["amber","blue","brown","cobalt","crimson","cyan","emerald","green","indigo","lime","magenta","mango","mauve","orange","olive","pink","purple","violet","red","sienna","steel","teal","yellow","black"]

	attrList = ["","","","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile","live-tile"];

	function staticTiles()
	{
		//Create tiles for each item in the initial list
		for(i=3;i<attrList.length;i++)
		{
			addTile(i,content_array);
		}
	}

	createVideoTile();
	createImageTiles();
	staticTiles();
	updateVideoTile("");
	updateImages(2,["https://coursera.s3.amazonaws.com/topics/ml/large-icon.png"]);
	

	function DynamicTiles(t,content_array)
	{
		//Create tiles dynamically
		attrList.push("live-tile");
		addTile(t,content_array);
	}
	for(t=11;t<18;t++)
	{
		DynamicTiles(t,[""]);
	}
		
	function createImageTiles()
	{
		othis.div = document.createElement("div");
		othis.div.id = "tile2";
		randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
		othis.div.setAttribute("class","live-tile two-wide"+" "+randColor);
		othis.tilediv.appendChild(othis.div);

		othis.div = document.createElement("div");
		othis.div.id = "tile3";
		randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
		othis.div.setAttribute("class","live-tile two-wide"+" "+randColor);
		othis.tilediv.appendChild(othis.div);
	}

	function updateImages(tile_id,urls)
	{
		var tile = document.getElementById("tile"+tile_id);
		var img = document.createElement("img");
		img.setAttribute("class","live-tile two-wide");
		// for(var i=0;i<urls.length;i++)
		// {
			img.src = urls[0];
			// tile.appendChild(img);
		// }
		othis.tilediv.replaceChild(img,tile);
	}

	function createVideoTile()
	{
		othis.div = document.createElement("div");
		othis.div.id = "tile1";
		randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
		othis.div.setAttribute("class","live-tile two-wide two-tall"+" "+randColor);
		othis.tilediv.appendChild(othis.div);
	}
	function updateVideoTile(url)
	{
		vid = document.getElementById("tile1");
		frame = document.createElement("iframe");
		frame.setAttribute('allowFullScreen','');
		frame.setAttribute("class","live-tile two-wide two-tall");
		frame.src = "https://www.youtube.com/embed/9Sc-ir2UwGU";

		othis.tilediv.replaceChild(frame,vid);
	}

	//Function to create a single tile. Takes the tile count and the content to be displayed in it.
	function addTile(i,content)
	{
		othis.div = document.createElement("div");
		tile_no = i+1;
		othis.div.id = "tile"+tile_no;
		othis.div.setAttribute("url","#");
		randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
		othis.div.setAttribute("class",attrList[i]+" accent "+randColor+" exclude");
		span = document.createElement("span");
		span.setAttribute("class","tile-title");
		
		span.innerHTML = "tile"+tile_no;
		othis.div.appendChild(span);		

		for(var k=0;k<content.length;k++)
		{
			othis.cdiv = document.createElement("div");
			othis.cdiv.setAttribute("class",attrList[i]+" accent "+randColor+" exclude");
			othis.cdiv.innerHTML = content[i];
			// othis.cdiv.style.display = "none";
			othis.div.appendChild(othis.cdiv);
		}

		othis.tilediv.appendChild(othis.div);
		animate();
	};


	function animate()
	{
		$(".live-tile").liveTile();
		$( ".tiles" ).sortable();
		$( ".tiles" ).disableSelection();
	};
}

