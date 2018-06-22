// This is the js for the default/checkout.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.get_cart_price = function() {
        var total = 0;
        items = self.vue.cart;
        for (var i = 0; i < items.length; i++) {
            total += parseFloat(items[i].price);
        }
        self.vue.cart_total = total.toFixed(2);
    };

    self.check_logged_in = function() {
        $.getJSON(check_logged_in_url, function (data) {
            self.vue.is_open = data.is_open;
            if (data.logged_in == false) {self.vue.is_logged_in = false}
            else self.vue.is_logged_in = true;
        })
    };

    self.get_cart = function() {
        var cart_string = [];
        if (localStorage.getItem('cart') != undefined) {
            self.vue.JSONcart = (localStorage.getItem('cart'));
            //have to parse JSON cart; gets parsed into array of strings
            self.vue.cart = (JSON.parse(localStorage.getItem('cart')));
            //have to parse the int from each string item in array
        }
        self.get_cart_price();
    };


    self.get_order = function () {
        console.log("in get_order")
        $.getJSON(get_order_url, {
            order_name: "Faaat Order"
        }, function (data) {
            // left as json string to store in local storage
            cart_string = data.cart_order;
            // parsed so that vue can read
            self.vue.cart = (self.vue.JSONcart);
            // store in local storage
            localStorage.setItem('cart', cart_string);
        })
    };

    self.upload_saved_order = function() {
        $.getJSON(upload_saved_order_url, {
                cart: self.vue.JSONcart,
                order_name: self.vue.saved_order_name
            },
            function (data) {
        });
        self.vue.order_saved = true;
    };

    self.toggle_save_order = function() {
        self.vue.is_saving_order = !self.vue.is_saving_order;
        self.vue.show_save_order_btn = !self.vue.show_save_order_btn;
    };

    /*
     * Will one day calculate estimated wait time
     * Just gives random number for now
     */
    self.est_wait = function() {
        cart = JSON.stringify([]);
        localStorage.setItem('cart', cart);

        self.vue.order_placed = true;
        self.vue.est_wait_time = Math.floor(Math.random() * 15);
    };


    self.toggle_checkout = function() {
            self.stripe_instance = StripeCheckout.configure({
                key: 'pk_test_SWTNPU7yQR2AvHIxKOZ1VbzH',    //put your own publishable key here
                image: 'https://dining.ucsc.edu/images/banana-joes-740.jpg',
                locale: 'auto',
                token: function(token, args) {
                    console.log('got a token. sending data to localhost.');
                    self.stripe_token = token;
                    self.send_data_to_server();
                    //self.customer_info = args;
                    //self.send_data_to_server();
                }
            });

    };

    self.pay = function () {
        self.stripe_instance.open({
            name: "Checkout",
            description: "Pay with Card",
            billingAddress: true,
            amount: Math.round(self.vue.cart_total * 100),
        });
    };

    self.send_data_to_server = function () {
        // Calls the server.
        $.post(purchase_url,
            {
                transaction_token: JSON.stringify(self.stripe_token),
                amount: self.vue.cart_total,
                cart: JSON.stringify(self.vue.cart),
            },
            function (data) {
                // The order was successful.
                //self.goto('prod');
                $.web2py.flash("Thank you for your purchase");
            }
        );
        //cart = JSON.stringify([]);
        //localStorage.setItem('cart', cart);
        //self.vue.order_placed = true;
        self.vue.est_wait()
    };




    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            user_images: [],
            users_list: [],
            current_user: "",
            price: null,
            cart: [],
            JSONcart: "",
            cart_total: 0.00,
            save_order_bool: false,
            saved_order_name: "",
            show_save_order_btn: true,
            is_saving_order: false,
            order_saved: false,
            order_placed: false,
            est_wait_time: 0,
            is_open: true,
            show_meals: true,
            show_coming_soon_icon: false,
            is_logged_in: false
        },
        methods: {
            get_cart: self.get_cart,
            get_cart_price: self.get_cart_price,
            toggle_checkout: self.toggle_checkout,
            toggle_save_order: self.toggle_save_order,
            est_wait: self.est_wait,
            upload_saved_order: self.upload_saved_order,
            get_order: self.get_order,
            check_logged_in: self.check_logged_in,
            pay: self.pay
        }

    });

    self.check_logged_in();
    self.get_cart();
    self.toggle_checkout();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
