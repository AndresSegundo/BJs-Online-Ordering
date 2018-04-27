function openNav() {
    document.getElementById("nav").style.width = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("container").style.opacity = "0.5";
    document.getElementById("nav-container").style.visibility = "visible";
}

function closeNav() {
    document.getElementById("nav-container").style.visibility = "hidden";
    document.getElementById("nav").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("container").style.opacity = "1";
}



