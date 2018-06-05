var cart = [];

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
    cart = [String(id)];
    if (localStorage.cart != undefined) {
        var temp = JSON.parse(localStorage.getItem('cart'));
        cart = cart.concat(temp);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    if (bool) {
        closeView(id);
    } else {
        closeBack(id);
    }
};

remove = function() {
    localStorage.removeItem('cart');
};

print = function() {
    var temp = [];
    var temp2 = [];
    if (localStorage.getItem('cart') != undefined) {
        temp = (JSON.parse(localStorage.getItem('cart')));
        for(var i = 0; i< temp.length; i++) {
            temp2.push(parseInt(temp[i]));
        }
    }
    console.log(temp2);
};