// This is the js for the default/cart.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings
	
	
	self.retrieve_cart = function(){
		if (localStorage.cart) {
			self.vue.cart = JSON.parse(localStorage.cart);
		};
	};
	
	self.calculate_total = function(){
		var total = 0;
		cart = self.vue.cart;
		for (var i = 0; i < cart.length; i++){
			total += parseFloat(cart[i].price);
		};
		self.vue.cart_total = total.toFixed(2);
	};
	
	self.remove_order = function(order){
		var index = self.vue.cart.indexOf(order);
		self.vue.cart.splice(index, 1);
		self.save_cart();
		self.calculate_total();
	}
	
	self.save_cart = function(){
		cart_parsed = JSON.stringify(self.vue.cart);
		localStorage.cart = cart_parsed;
	}
	
	self.delete_comment = function(order){
		var index = self.vue.cart.indexOf(order);
		order = self.vue.cart[index];
		order.is_comment = false;
		order.comment = "";
		self.vue.cart[index] = order;
		self.save_cart();
	}
	
	self.add_comment = function(order){
		var index = self.vue.cart.indexOf(order);
		order = self.vue.cart[index];
		order.is_comment = true;
		self.vue.cart[index] = order;
		self.save_cart();
	}
	
	self.save_comment = function(order){
		self.save_cart();
	}
	
	self.create_test_order = function(){
		var id = Math.floor(Math.random() * 10);
		var price = (Math.random() * 12).toFixed(2);
		var comment = '';
		
		var is_comment;
		if (comment == ''){
			is_comment = false;
		}else{
			is_comment = true;
		}
		
		var order = {
			id: id,
			price: price,
			is_comment: is_comment,
			comment: comment,
		};
		
		self.vue.cart.push(order);
		
		self.save_cart();
		
		self.calculate_total();
	};

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        methods: {
			create_test_order: self.create_test_order,
			calculate_total: self.calculate_total,
			remove_order: self.remove_order,
			delete_comment: self.delete_comment,
			add_comment: self.add_comment,
			save_comment: self.save_comment,
        },
        data: {
			cart: [],
			cart_total: 0,
        }
    });
	
	self.retrieve_cart();
	self.calculate_total();
	
	$("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
