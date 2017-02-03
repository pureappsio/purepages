Router.route("/api/brands", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        var brands = Brands.find({}).fetch();

        this.response.end(JSON.stringify({ brands: brands }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route("/api/pages", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        if (this.params.query.brand) {
            var pages = Pages.find({ brandId: this.params.query.brand }).fetch();
        } else {
            var pages = Pages.find({}).fetch();
        }

        this.response.end(JSON.stringify({ pages: pages }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route("/api/pages/:_id", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        // Get page
        var page = Pages.findOne(this.params._id);

        Meteor.call('renderPage', page.url, this.params.query);
        var renderedPage = Pages.findOne(page._id);
        var answer = { page: renderedPage };

        // } else {
        //     if (page.html && page.cached == true) {
        //         var answer = { page: page };
        //     } else {
        //         Meteor.call('renderPage', page.url);
        //         var renderedPage = Pages.findOne(page._id);
        //         var answer = { page: renderedPage };
        //     }
        // }

        this.response.end(JSON.stringify(answer));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route("/api/header", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;
    if (this.params.query.brand) {
        var brandId = this.params.query.brand;
    }
    if (this.params.query.page) {
        var pageId = this.params.query.page;
    }

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        // Render header
        if (this.params.query.brand) {
            var html = Meteor.call('renderHeader', { brandId: brandId });
        }
        if (this.params.query.page) {
            var page = Pages.findOne(pageId);

            // Check if page need FB pixel event
            if (page.model == 'thankyou' || page.model == 'tripwire') {
                var html = Meteor.call('renderHeader', { brandId: page.brandId, lead: true, pageTitle: page.name });
            } else {
                var html = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name });
            }

        }

        // Get header
        var header = {
            html: html
        }

        this.response.end(JSON.stringify({ header: header }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});
