Router.configure({
    layoutTemplate: 'layout'
});

// Admin route
Router.route('/admin', { name: 'admin' });
Router.route('/login', { name: 'login' });

// Edit brand
Router.route('/brands/edit/:id', {

    waitOn: function() {
        return Meteor.subscribe('userBrands');
    },

    name: 'brandEdit',
    data: function() {
        if (this.ready()) {
            return Brands.findOne(this.params.id);
        }
    }

});

// Edit
Router.route('/pages/edit/:id', {

    waitOn: function() {
        return [Meteor.subscribe('userPages'), Meteor.subscribe('userBrands')];
    },

    name: 'pageEdit',
    data: function() {
        if (this.ready()) {
            return Pages.findOne(this.params.id);
        }
        else {
            this.render('loading');
        }
    }

});

// Main route
Router.route('/:url', {
    name: 'page',
    waitOn: function() {
        return [Meteor.subscribe('userPages'), Meteor.subscribe('userBrands')];
    },
    data: function() {

        if (this.ready()) {

            // Get page
            var page = Pages.findOne({ url: this.params.url });

            // Set elements
            DocHead.setTitle(page.name);
            var linkInfo = {
                rel: "icon",
                type: "image/png",
                href: "https://marcoschwartz.com/wp-content/uploads/2016/03/favicon-1.jpg"
            };
            DocHead.addLink(linkInfo);

            return page;

        }
        else {
            this.render('loading');
        }

    }
});
