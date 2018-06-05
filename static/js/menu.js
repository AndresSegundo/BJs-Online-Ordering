var cart = [];

window.onclick = function(event) {
    console.log(event.target);
};

openView = function(id) {
    var link = 'quickview' + id;
    document.getElementById(link).style.display = "block";
    document.getElementById(link).onclick = function(event) {
        if (event.target == document.getElementById(link)) {
            document.getElementById(link).style.display = "none";
        }
    }
};

closeView = function(id) {
    var link = 'quickview' + id;
    document.getElementById(link).style.display = "none";
};

viewBack = function(id) {
    var link = 'custorder' + id;
    var temp = 'quickview' + id;
    document.getElementById(temp).style.display = "none";
    document.getElementById(link).style.display = "block";
    document.getElementById(link).onclick = function(event) {
        if (event.target == document.getElementById(link)) {
            document.getElementById(link).style.display = "none";
        }
    }
};

closeBack = function(id) {
    var link = 'custorder' + id;
    var temp = 'quickview' + id;
    document.getElementById(link).style.display = "none";
    document.getElementById(temp).style.display = "block";
};

add_cart = function(item) {

};