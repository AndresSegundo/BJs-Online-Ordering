var cart = [];
var comment = [];

// window.onclick = function(event) {
//     console.log(event.target);
// };

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

add_cart = function(bool, id) {
    // Set cart to string value of id
    comment = [String(document.getElementById('comment'+id).value)];
    document.getElementById('comment'+id).value = "";

    cart = [String(id)];
    if (localStorage.cart != undefined) {
        var temp = JSON.parse(localStorage.getItem('cart'));
        cart = cart.concat(temp);
    }
    if (localStorage.comment != undefined) {
        var temp = JSON.parse(localStorage.getItem('comment'));
        comment = comment.concat(temp);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('comment', JSON.stringify(comment));
    if (bool) {
        closeView(id);
    } else {
        closeBack(id);
    }
};

remove = function() {
    localStorage.removeItem('cart');
    localStorage.removeItem('comment');
};

print = function() {
    var temp = [];
    var temp2 = [];
    var temp3 = [];
    if (localStorage.getItem('cart') != undefined) {
        temp = (JSON.parse(localStorage.getItem('cart')));
        for(var i = 0; i< temp.length; i++) {
            temp2.push(parseInt(temp[i]));
        }
    }
    if (localStorage.getItem('comment') != undefined) {
        temp = (JSON.parse(localStorage.getItem('comment')));
        for(var i = 0; i< temp.length; i++) {
            temp3.push(temp[i]);
        }
    }
    console.log(temp2);
    console.log(temp3);
};
