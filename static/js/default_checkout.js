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

    self.edit_checklist = function(checklist_id) {
        $.post(edit_checklist_url,
            {
                checklist_id: checklist_id,
                edit_title: self.vue.edit_title,
                edit_memo: self.vue.edit_memo
            },
            function () {
                for (var i = 0; i < self.vue.checklists.length; i++) {
                    if (self.vue.checklists[i].id === checklist_id) {
                        self.vue.checklists[i].title = self.vue.edit_title;
                        self.vue.checklists[i].memo = self.vue.edit_memo;   
                        break;
                    }
                }
            });
    };

    self.delete_checklist = function (checklist_id) {
        $.post(del_checklist_url,
            {
                checklist_id: checklist_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.checklists.length; i++) {
                    if (self.vue.checklists[i].id === checklist_id) {
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.checklists.splice(idx - 1, 1);
                }
            }
        )
    };

    self.pay = function () {
        self.stripe_instance.open({
            name: "Your nice cart",
            description: "Buy cart content",
            billingAddress: true,
            shippingAddress: true,
            amount: Math.round(self.vue.cart_total * 100),
        });
    };

    self.goto = function (page) {
        self.vue.page = page;
        if (page == 'cart') {
            // prepares the form.
            self.stripe_instance = StripeCheckout.configure({
                key: 'pk_test_CeE2VVxAs3MWCUDMQpWe8KcX',    //put your own publishable key here
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: function(token, args) {
                    console.log('got a token. sending data to localhost.');
                    self.stripe_token = token;
                    self.customer_info = args;
                    self.send_data_to_server();
                }
            });
        };

    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            cart_total: 10,
            page: 'prod',
            auth_user: null,
            
        },
        methods: {
            get_more: self.get_more,
            edit_button: self.edit_button,
            edit_checklist: self.edit_checklist,
            delete_checklist: self.delete_checklist,
            pay: self.pay
        }
    });

    self.get_checklists();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
