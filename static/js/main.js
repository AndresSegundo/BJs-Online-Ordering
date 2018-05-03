function openNav() {
	setTimeout(function(){
		document.getElementById("sidebar-container").style.visibility = "visible";
	}, 200);
    document.getElementById("sidebar").style.width = "250px";
     document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("main").style.opacity = "0.5";
	document.getElementById("logo_container").style.marginLeft = "180px";
 }

 function closeNav() {
    document.getElementById("sidebar-container").style.visibility = "hidden";
    document.getElementById("sidebar").style.width = "0";
    document.body.style.backgroundColor = "lightgray";
    document.getElementById("main").style.opacity = "1";
	document.getElementById("logo_container").style.marginLeft = "60px";
}