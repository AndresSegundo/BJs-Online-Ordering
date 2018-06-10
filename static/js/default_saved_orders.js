
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
				saved_orders = [];
				for (i = 0; i < data.saved_orders.length; i++){
					order = {
						name: data.saved_orders[i].order_name.substring(0,30),
						price: null,
						items: JSON.parse(data.saved_orders[i].cart),
						order_name: data.saved_orders[i].order_name,
					};
					
					total_price = 0;
					for (j = 0; j < order.items.length; j++){
						total_price += parseFloat(order.items[j].price);
					}
					
					order.price = total_price.toFixed(2);
					
					saved_orders.push(order);
				};
				
				self.vue.saved_orders = saved_orders;
				console.log(saved_orders);
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
					/* {
						price:"10.00", 
						items:[{name:"Test Item", comment:"", is_comment: false, price:"10.00"}]
					}, 
					{ 	price:"20.00",
						items:[{name:"Test Item 1", comment:"test comment", is_comment: true, price:"10.00"}, {name:"Test Item 2", comment:"", is_comment: false, price:"10.00"}]
					} */
				],
			cart: [],
        }
    });
	
	self.get_saved_orders();
	$("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});