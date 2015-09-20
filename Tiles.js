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
	xhr.send();

	setTimeout(getContents,20000);
}

function getResults()
{
	if(xhr.readyState == 4 && xhr.status == 200)
	{
		res = JSON.parse(xhr.responseText);			
		// alert(res);
		// console.log(res);
		alert(count);
		for(i=1;i<=count;i++)
		{
			updateContent(i,res.d.results[i]['Description'],res.d.results[i]['Url']);
		}
	}
}


function updateContent(tile_id,content,url)
{
	tile = document.getElementById("tile"+tile_id);

	tile.addEventListener("click",openNewTab(url));

	tile.firstChild.style.overflowY="auto";
	tile.firstChild.innerHTML = content;
};

function openNewTab(url)
{
	var newtab = window.open(url, '_blank'); 
	newtab.focus();
}

function TileAction()
{
	//Setup the page
	othis = this;
	count = 0;
	othis.tilediv = document.getElementById("mycontainer");
	othis.tilediv.style.overflowY = "auto";
	othis.tilediv.style.position = "absolute";
	othis.tilediv.style.left = window.innerWidth/2+10+"px";
	othis.tilediv.style.width = window.innerWidth/2+"px";

	tilecolors = ["amber","blue","brown","cobalt","crimson","cyan","emerald","green","indigo","lime","magenta","mango","mauve","orange","olive","pink","purple","violet","red","sienna","steel","teal","yellow","black"]

	attrList = ["live-tile","live-tile","live-tile two-wide","live-tile two-wide two-tall","live-tile","live-tile","live-tile","live-tile","live-tile two-wide","live-tile","live-tile"];

	function staticTiles()
	{
		//Create tiles for each item in the initial list
		for(i=0;i<attrList.length;i++)
		{
			addTile(i,content_array);
		}
	}
	staticTiles();

	function DynamicTiles(t,content_array)
	{
		//Create tiles dynamically
		attrList.push("live-tile");
		addTile(t,content_array);
	}
	for(t=11;t<19;t++)
	{
		DynamicTiles(t,[""]);
	}
		


	//Function to create a single tile. Takes the tile count and the content to be displayed in it.
	function addTile(i,content)
	{
		count++;
		othis.div = document.createElement("div");
		othis.div.id = "tile"+count;
		randColor = tilecolors[getRandomInt(0,tilecolors.length-1)];
		othis.div.setAttribute("class",attrList[i]+" "+randColor);
		
		//create the outer div		
		othis.div.setAttribute("data-mode","carousel");
		othis.div.setAttribute("data-direction","horizontal");
		othis.div.setAttribute("data-delay","10000");
		

		//create the front div
		othis.fdiv = document.createElement("div");
		var p = document.createElement("p");
		var a = document.createElement("a");
		a.setAttribute("class","metroLarger");
		a.href = "#";
		a.innerHTML = "Initial content";
		span = document.createElement("span");
		span.setAttribute("class","tile-title");
		span.innerHTML = "tile"+count;
		p.appendChild(a);
		othis.fdiv.appendChild(p);
		othis.fdiv.appendChild(span);

		// othis.div.appendChild(othis.fdiv);

		for(j=0;j<content.length;j++)
		{
			othis.bdiv = document.createElement("div");
			var p = document.createElement("p");
			var a = document.createElement("a");
			a.setAttribute("class","metroLarger");
			a.href = "#";
			a.innerHTML = content[j];
			span = document.createElement("span");
			span.setAttribute("class","tile-title");
			span.innerHTML = othis.div.id;
			p.appendChild(a);
			othis.bdiv.appendChild(p);
			othis.bdiv.appendChild(span);

			othis.div.appendChild(othis.bdiv);
		}

		//Old code for back div
		//create the back div
		// othis.bdiv = document.createElement("div");
		// var p = document.createElement("p");
		// var a = document.createElement("a");
		// a.setAttribute("class","metroLarger");
		// a.href = "#";
		// a.innerHTML = "back "+othis.count;
		// span = document.createElement("span");
		// span.setAttribute("class","tile-title");
		// span.innerHTML = othis.div.id;
		// p.appendChild(a);
		// othis.bdiv.appendChild(p);
		// othis.bdiv.appendChild(span);
		
		othis.div.appendChild(othis.fdiv);
		// othis.div.appendChild(othis.bdiv);
		
		if(count==10)
		{
			//Replace tile
			tile1 = document.getElementById("tile1");
			othis.tilediv.replaceChild(othis.div,tile1);
			othis.tilediv.appendChild(tile1);
			
		}
		else
		{
			//Append tile
			othis.tilediv.appendChild(othis.div);
		}
		//call animate
		animate();
	};


	function animate()
	{
		$(".live-tile").liveTile();
	// jQuery UI 
	// http://jqueryui.com/sortable/#display-grid
	// import jquery-ui cdn to use this
		$( ".tiles" ).sortable();
		$( ".tiles" ).disableSelection();
	};
}
