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

add_cart_1 = function(bool, id, name, price, image) {
    comment = [String(document.getElementById('comment'+id).value)];
    document.getElementById('comment'+id).value = "";
	
	comment_val = comment[0];
	
	if (comment_val != ''){
		is_comment = true;
	}else{
		is_comment = false;
	}

    var cart_item = {
            id: id,
            name: name,
            price: parseFloat(price).toFixed(2),
            image: "static/" + image,
			comment: comment_val,
			is_comment: is_comment,
    };
    cart = JSON.stringify([cart_item]);
    // Set cart to string value of id
    //cart = [String(cart_item.id)];
    if (localStorage.cart != undefined) {

        //Grab cart list from local storage
        var temp = JSON.parse(localStorage.getItem('cart'));
        temp.push(cart_item);
        cart = JSON.stringify(temp);
        //append cart list to string of current item id
        //cart = cart.concat(temp);
    }
    if (localStorage.comment != undefined) {
        var temp = JSON.parse(localStorage.getItem('comment'));
        comment = comment.concat(temp);
    }
    localStorage.setItem('cart', cart);
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
