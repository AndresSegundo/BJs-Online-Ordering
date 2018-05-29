// This is the js for the default/admin.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.insertion_id = null; // Initialization.

    function get_menuItems_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return menuItems_url + "&" + $.param(pp);
    }

    self.get_menuItems = function () {
        $.getJSON(get_menuItems_url(0, 10), function (data) {
            self.vue.menuItems = data.menuItems;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
            enumerate(self.vue.menuItems);
        })
    };

    self.add_item_button = function () {
        // This button is used to start the add of a new track; begins with upload.
        // Show the Dropzone plugin.
        $("div#add_item_div").show();
        //$("div#admin_panel").hide();
        // The button to add a track has been pressed.
        self.vue.is_adding_item = true;
    };

    self.add_item = function () {
        // Submits the track info.
        // This is the last step of the track insertion process.
        $.post(add_item_url,
            {
                name: self.vue.form_name,
                price: self.vue.form_price,
                allergens: self.vue.form_allergens,
                description: self.vue.form_description
            },
            function (data) {
                self.vue.user_images.push(data.menuItems);
                enumerate(self.vue.menuItems);
            });
    };

    self.delete_item = function(item_idx) {
        $.post(del_item_url,
            { menuItems_id: self.vue.menuItems[item_idx].id },
            function () {
                self.vue.menuItems.splice(item_idx, 1);
                enumerate(self.vue.menuItems);
            }
        )
    };

    self.cancel_add_item = function() {
        self.vue.is_adding_item_info = false;
        self.vue.is_adding_item = false;
        $("div#add_item_div").hide();
        //$("div#admin_panel").show();
        $.post(cleanup_url); // Cleans up any incomplete uploads.
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_adding_item: false,
            is_adding_item_info: false,
            menuItems: [],
            logged_in: false,
            has_more: false,
            form_name: null,
            form_price: null,
            form_allergens: null,
            form_description: null,
            form_nutrition: null,
            form_category: null,
            form_id: null,
            form_ingredients: null,
            form_is_featured: false,
            selected_id: -1  // Track selected to play.
        },
        methods: {
            get_more: self.get_more,
            add_item_button: self.add_item_button,
            add_item: self.add_item,
            delete_item: self.delete_item,
            cancel_add_item: self.cancel_add_item
        }

    });

    self.get_menuItems();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

