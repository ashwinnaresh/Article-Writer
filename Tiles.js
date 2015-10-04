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

function updateVideoTile(url)
{
	// https://www.youtube.com/watch?v=9Sc-ir2UwGU
	vid_id = url.split("=")[1];
	vid = document.getElementById("tile1");
	frame = document.createElement("iframe");
	frame.setAttribute('allowFullScreen','');
	frame.setAttribute("class","live-tile two-wide two-tall");
	frame.src = "https://www.youtube.com/embed/9Sc-ir2UwGU";
	// frame.src = "https://www.youtube.com/embed/"+vid_id

	othis.tilediv.replaceChild(frame,vid);
}

function updateImages(tile_id,urls)
{
	var tile = document.getElementById("tile"+tile_id);
	var img = document.createElement("img");
	img.setAttribute("class","live-tile two-wide");
	for(var i=0;i<urls.length;i++)
	{
		img.src = urls[i];
	}
	othis.tilediv.replaceChild(img,tile);
}

