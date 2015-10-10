function getContents()
{
	var content = editor.getContent();
	prev = content;
	$.ajax({url:"http://localhost/Article-Writer/server/Server.php",
			type:"GET",
			data:"demo_text="+encodeURI(content),
			success: function(data)
			{
				// console.log("data type "+typeof(data));
				res = JSON.parse(data);
				// console.log(res[0]['results'][0]['Description']);
				// console.log(res[1]['results'][1]['Description']);
				var count = 0;
				for(j=updated_tile_count;j<updated_tile_count+2;j++)
				{
					alert(updated_tile_count);
					content_array = [];
					url_array = [];
					for(i=0;i<5;i++)
					{
						content_array.push(res[count]['results'][i]['Description']);
						url_array.push(res[count]['results'][i]['Url']);
						// console.log("Desc : "+res[count]['results'][i]['Description']+" URL : "+res[count]['results'][i]['Url']);
					}
					count++;
					updateTiles(j,content_array,url_array);
					//updated_tile_count++;
				}

				updated_tile_count+=2;
			},
			error : function(){console.log("Could not get data");}
		});
	// updateVideoTile("https://www.youtube.com/watch?v=9Sc-ir2UwGU");
	// updateImages(2,["https://coursera.s3.amazonaws.com/topics/ml/large-icon.png"]);
	// updateImages(3,["http://www.cs.toronto.edu/~urtasun/courses/CSC2515/CSC2515_Winter15_files/machine_learning.jpg"]);
	
}

function checkContents()
{
	var content = editor.getContent();
	if(prev!=content)
		getContents();
	setTimeout(checkContents,20000);
}

function getMediaContents()
{
	var content = editor.getContent();
	$.ajax({
		url : "http://localhost/Article-Writer/server/mediaServer.php?demo_text="+encodeURI(content),
		type : "GET",
		success : function(data){
			res = JSON.parse(data);
			console.log("Media data : ");
			console.log(res);
			updateVideoTile(res[0]['results']['video']);
			updateImages(2,[res[0]['results']['img1']['url']],res[0]['results']['img1']['src']);
			updateImages(3,[res[0]['results']['img2']['url']],res[0]['results']['img2']['src']);
		},
		error : function(){console.log("could not get data");}
	});
	setTimeout(getMediaContents,100000);
}


// function updateContent(tile_id,content,url)
// {
// 	// content = "HI THERE";
// 	var tile = document.getElementById("tile"+tile_id);

// 	tile.addEventListener("click",function(){
// 		// alert(url);
// 		tile.setAttribute("url",url);
// 		newtab = window.open(tile.getAttribute("url"), '_blank'); 
// 		newtab.focus();
// 	},false);

// 	tile.style.overflowY = "auto";
// 	tile.innerHTML = content;
// }

function updateVideoTile(url)
{
	var vid_id = url.split("=")[1];
	var vid_tile = document.getElementById("tile1");
	frame = document.createElement("iframe");
	frame.setAttribute('allowFullScreen','');
	frame.setAttribute("class","live-tile two-wide two-tall");
	frame.src = "https://www.youtube.com/embed/"+vid_id;

	// tilediv.replaceChild(frame,vid_tile);
	vid_tile.appendChild(frame);
}

function updateImages(tile_id,urls,src)
{
	var tile = document.getElementById("tile"+tile_id);
	tile.setAttribute("url",src);
	tile.addEventListener("click",function(){
		var newtab = window.open(tile.getAttribute("url"), '_blank'); 
		newtab.focus();
	},false);
	var img = document.createElement("img");
	img.setAttribute("class","live-tile two-wide");
	for(var i=0;i<urls.length;i++)
	{
		img.src = urls[i];
	}
	// tilediv.replaceChild(img,tile);
	tile.appendChild(img);
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
				var newtab = window.open(cdiv.getAttribute("url"), '_blank'); 
				newtab.focus();
			},false);
			div.appendChild(cdiv);
		}
		div.style.overflowY = "auto";
		animate();
	}
	else if(i>=11 && i<20)
	{
		DynamicTiles(i,content_array,url_array);
	}
}
