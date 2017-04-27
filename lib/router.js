Router.configure({
    layoutTemplate: 'layout'
});

// Admin route
Router.route('/admin/panel', {
    name: 'admin',
    data: function() {
        if (Meteor.user()) {
            this.render('admin');
        } else {
            this.render('login');
        }
    }
});
Router.route('/admin/login', { name: 'login' });

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
        return [Meteor.subscribe('userElements'), Meteor.subscribe('userPages'), Meteor.subscribe('userBrands'), Meteor.subscribe('files.images.all')];
    },

    name: 'pageEdit',
    data: function() {
        if (this.ready()) {
            return Pages.findOne(this.params.id);
        } else {
            this.render('loading');
        }
    }

});

// Stats
Router.route('/pages/stats/:id', {

    waitOn: function() {
        return [Meteor.subscribe('userPages'), Meteor.subscribe('userSessions')];
    },

    name: 'pageStats',
    data: function() {
        if (this.ready()) {
            return Pages.findOne(this.params.id);
        } else {
            this.render('loading');
        }
    }

});

// SSR page route
Router.map(function() {
    this.route('postserver', {
        where: 'server',
        path: '/:post_url',
        action: function() {

            // Get user location
            var location = Meteor.call('getUserLocation', this.request.headers);

            // Query
            query = this.params.query;
            query.location = location;

            if (Pages.findOne({ url: this.params.post_url })) {

                // Render HTML
                var html = Meteor.call('renderPage', this.params.post_url, query);

                // Response
                this.response.writeHead(200, { 'Content-Type': 'text/html', 'Vary': 'accept-encoding' });
                this.response.write(html);
                this.response.end();
            }


        }

    });
});
