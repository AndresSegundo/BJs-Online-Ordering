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
    * Since the cart is just an array of ID's, we have to
    * get the prices by looking them up on the menu database
    * in a separate function.
     */
    self.get_cart_price = function() {
        var total = 0;
        items = self.vue.cart;
        for (var i = 0; i < items.length; i++) {
            total += parseFloat(items[i].price);
        }
        self.vue.cart_total = total.toFixed(2);
    };

    self.get_cart_images = function() {

    };

    self.check_logged_in = function() {
        $.getJSON(check_logged_in_url, function (data) {
            if (data.logged_in == false) {self.vue.is_logged_in = false}
            else self.vue.is_logged_in = true;
        })
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
                self.vue.saved_order_name
            });
            self.vue.order_saved = true;
    };

    // testing order saving in local storage until account db is figured out
    self.save_order = function() {
        // can't just do this b/c we have to append non-json order to non-json orders list
        //var order =  localStorage.cart;

        var order = {
            name: self.vue.saved_order_name,
            cart: self.vue.cart
        };
        var saved_orders = JSON.stringify([order]);
        // Set cart to string value of id
        //cart = [String(cart_item.id)];
        if (localStorage.saved_orders != undefined) {

            //Grab cart list from local storage
            var temp = JSON.parse(localStorage.getItem('saved_orders'));
            temp.push(order);
            saved_orders = JSON.stringify(temp);
            //append cart list to string of current item id
            //cart = cart.concat(temp);
        }
        localStorage.setItem('saved_orders', saved_orders);
        self.vue.order_saved = true;

    };

    self.get_saved_orders = function() {
        $.getJSON(get_saved_orders_url, function (data) {
            self.vue.order_name = data.name
        })
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
                console.log("it worked!");
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
            is_saving_order: false,
            order_saved: false,
            is_logged_in: false
        },
        methods: {
            get_cart: self.get_cart,
            get_cart_images: self.get_cart_images,
            get_cart_price: self.get_cart_price,
            toggle_checkout: self.toggle_checkout,
            toggle_save_order: self.toggle_save_order,
            save_order: self.save_order,
            upload_saved_order: self.upload_saved_order,
            get_saved_order: self.get_saved_orders,
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