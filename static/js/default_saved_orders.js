
// This is the js for the default/cart.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings
		
	self.retrieve_cart = function(){
		if (localStorage.cart) {
			self.vue.cart = JSON.parse(localStorage.cart);
		};
	}
	
	self.get_saved_orders = function(){
		$.getJSON(get_saved_orders_url,
			function(data){
				
			}	
		);
	}
	
	self.add_order_to_cart = function(order){
		self.retrieve_cart();
		for (var i = 0; i < order.items.length; i++){
			self.vue.cart.push(order.items[i]);
		}
		self.save_cart();
 	}
	
	self.save_cart = function(){
		cart_parsed = JSON.stringify(self.vue.cart);
		localStorage.cart = cart_parsed;
	}

    // Complete as needed.

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        methods: {
			add_order_to_cart: self.add_order_to_cart,
        },
        data: {
			saved_orders: [ 
					{
						price:"10.00", 
						items:[{name:"Test Item", comment:"", is_comment: false, price:"10.00"}]
					}, 
					{ 	price:"20.00",
						items:[{name:"Test Item 1", comment:"test comment", is_comment: true, price:"10.00"}, {name:"Test Item 2", comment:"", is_comment: false, price:"10.00"}]
					}
				],
			cart: [],
        }
    });
	
	
	$("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});