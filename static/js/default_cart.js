// This is the js for the default/cart.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings
	
	
	self.retrieve_orders = function(){
		if (localStorage.orders) {
			self.vue.orders = JSON.parse(localStorage.orders);
		};
	};
	
	self.calculate_total = function(){
		var total = 0;
		orders = self.vue.orders;
		for (var i = 0; i < orders.length; i++){
			total += parseFloat(orders[i].price);
		};
		self.vue.cart_total = total.toFixed(2);
	};
	
	self.remove_order = function(order){
		var index = self.vue.orders.indexOf(order);
		self.vue.orders.splice(index, 1);
		self.save_orders();
		self.calculate_total();
	}
	
	self.save_orders = function(){
		orders_parsed = JSON.stringify(self.vue.orders);
		localStorage.orders = orders_parsed;
	}
	
	self.create_test_order = function(){
		var id = Math.floor(Math.random() * 10);
		var price = (Math.random() * 12).toFixed(2);
		
		var order = {
			id: id,
			price: price,
		};
		
		self.vue.orders.push(order);
		
		self.save_orders();
		
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
        },
        data: {
			orders: [],
			cart_total: 0,
        }
    });
	
	self.retrieve_orders();
	self.calculate_total();
	
	$("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
