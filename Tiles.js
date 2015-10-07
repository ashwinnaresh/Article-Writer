function getContents()
{
	var content = editor.getContent();

	$.ajax({url:"http://localhost/Article-Writer/server/Server.php",
			type:"GET",
			data:"demo_text="+encodeURI(content),
			success: function(data)
			{
				console.log(typeof(data));
				res = JSON.parse(data);
				console.log(res[0]);
				for(i=1;i<=count;i++)
				{
					updateContent(i,res[i]['Description'],res[i]['Url']);
				}
			},
			error : function(){console.log("Could not get data");}
		});
	updateVideoTile("https://www.youtube.com/watch?v=9Sc-ir2UwGU");
	updateImages(2,["https://coursera.s3.amazonaws.com/topics/ml/large-icon.png"]);
	updateImages(3,["http://www.cs.toronto.edu/~urtasun/courses/CSC2515/CSC2515_Winter15_files/machine_learning.jpg"]);
	setTimeout(getContents,20000);
}


function updateContent(tile_id,content,url)
{
	var tile = document.getElementById("tile"+tile_id);

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
	var vid_id = url.split("=")[1];
	var vid_tile = document.getElementById("tile1");
	frame = document.createElement("iframe");
	frame.setAttribute('allowFullScreen','');
	frame.setAttribute("class","live-tile two-wide two-tall");
	frame.src = "https://www.youtube.com/embed/"+vid_id;

	othis.tilediv.replaceChild(frame,vid_tile);
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

