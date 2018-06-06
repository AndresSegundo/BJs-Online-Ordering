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

    self.openView = function(id) {
        var link = 'quickview' + id;
        document.getElementById(link).style.display = "block";
        document.getElementById(link).onclick = function(event) {
            if (event.target == document.getElementById(link)) {
                document.getElementById(link).style.display = "none";
            }
        }
    };

    self.closeView = function(id) {
        var link = 'quickview' + id;
        document.getElementById(link).style.display = "none";
    };

    self.viewBack = function(id) {
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

    self.closeBack = function(id) {
        var link = 'custorder' + id;
        var temp = 'quickview' + id;
        document.getElementById(link).style.display = "none";
        document.getElementById(temp).style.display = "block";
    };

    self.add_cart = function(item) {
        self.vue.closeView(item.id);
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            cart: []
        },
        methods: {
            openView: self.openView,
            closeView: self.closeView,
            viewBack: self.viewBack,
            closeBack: self.closeBack,
            add_cart: self.add_cart
        }
    });

    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

