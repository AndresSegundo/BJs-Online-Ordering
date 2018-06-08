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

    self.counter = 0;  

    function get_checklists_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return checklists_url + "?" + $.param(pp);
    }

    self.get_checklists = function () {
        $.getJSON(get_checklists_url(0, 10), function (data) {
            self.vue.checklists = data.checklists;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            self.vue.auth_user = data.auth_user;
        })
    };

    /*
    * SHOULD BE IMPLEMENTED FULLY IN CART PAGE
    * Since the cart is just an array of ID's, we have to
    * get the prices by looking them up on the menu database
    * in a separate function.
     */
    self.get_cart_price = function() {
        self.vue.cart_total = 20.00.toFixed(2);
        items = self.vue.cart;
        for (var i = 0; i < items.length; i++) {
            self.vue.cart_total = parseFloat(items[i].price).toFixed(2);
        }
    };

    self.get_cart_images = function() {

    };

    self.get_cart = function() {
        var cart_string = [];
        if (localStorage.getItem('cart') != undefined) {
            //have to parse JSON cart; gets parsed into array of strings
            self.vue.cart = (JSON.parse(localStorage.getItem('cart')));
            //have to parse the int from each string item in array
        }
        self.get_cart_images();
        self.get_cart_price();
    };


    self.get_more = function () {
        var num_checklists = self.vue.checklists.length;
        $.getJSON(get_checklists_url(num_checklists, num_checklists + 50), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.checklists, data.checklists);
        });
    };


    self.toggle_public_button = function() {
        self.vue.is_public = !self.vue.is_public;
    }



    self.edit_button = function() {
        self.vue.edit_title = null;
        self.vue.edit_memo = null;
        self.vue.is_editting_checklist = !self.vue.is_editting_checklist;
    }

    self.upload_saved_order = function() {
        self.toggle_save_order();
        $.post(save_order_url,
            {
                order: self.vue.cart,
                order_name: self.vue.saved_order_name
            },
            function (data) {
                console.log("here")
                self.vue.saved_order_name = ""
            });
    };

    self.save_order = function() {

    };

    self.toggle_save_order = function() {
        self.vue.is_saving_order = !self.vue.is_saving_order;
        self.vue.show_save_order_btn = !self.vue.show_save_order_btn;
    };

    self.toggle_checkout = function() {
            self.stripe_instance = StripeCheckout.configure({
                key: 'pk_test_SWTNPU7yQR2AvHIxKOZ1VbzH',    //put your own publishable key here
                image: 'https://dining.ucsc.edu/images/banana-joes-740.jpg',
                locale: 'auto',
                token: function(token, args) {
                    console.log('got a token. sending data to localhost.');
                    self.stripe_token = token;
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
        console.log("Payment for:", self.customer_info);
        // Calls the server.
        $.post(purchase_url,
            {
                customer_info: JSON.stringify(self.customer_info),
                transaction_token: JSON.stringify(self.stripe_token),
                amount: self.vue.cart_total,
                cart: JSON.stringify(self.vue.cart),
            },
            function (data) {
                // The order was successful.
                self.vue.cart = [];
                self.update_cart();
                self.store_cart();
                //self.goto('prod');
                $.web2py.flash("Thank you for your purchase");
            }
        );
    };




    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_uploading: false,
            user_images: [],
            users_list: [],
            current_user: "",
            price: null,
            cart: [],
            cart_total: 0.00,
            cart_images: [],
            save_order_bool: false,
            saved_order_name: "",
            show_save_order_btn: true,
            is_saving_order: false
        },
        methods: {
            get_cart: self.get_cart,
            get_cart_images: self.get_cart_images,
            get_cart_price: self.get_cart_price,
            toggle_checkout: self.toggle_checkout,
            toggle_save_order: self.toggle_save_order,
            save_order: self.save_order,
            upload_saved_order: self.upload_saved_order,
            pay: self.pay
        }

    });

    self.get_cart();
    self.toggle_checkout();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
