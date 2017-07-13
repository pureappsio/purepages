Router.route('/api/status', { where: 'server' }).get(function() {

    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify({ message: 'System online' }));

});

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

Router.route("/api/sessions", { where: "server" }).post(function() {

    // Get data
    var data = this.request.body;

    if (data.pageId && data.date) {

        data.date = new Date(data.date);

        Meteor.call('insertSession', data);

        // Send response
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify({ message: 'Session added' }));

    }

});

Router.route("/api/pages", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        // Query
        if (this.params.query.brand) {
            var pages = Pages.find({ brandId: this.params.query.brand }).fetch();
        } else {
            var pages = Pages.find({}).fetch();
        }

        // Add targets
        for (i in pages) {
            if (pages[i].model == 'salespage') {

                var brand = Brands.findOne(pages[i].brandId);
                var integration = Integrations.findOne(brand.cartId);
                var targetLink = integration.url;
                pages[i].target = targetLink;
            }
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

        // Add targets
        if (renderedPage.model == 'salespage') {

            var brand = Brands.findOne(renderedPage.brandId);
            var integration = Integrations.findOne(brand.cartId);
            var targetLink = integration.url;
            renderedPage.target = targetLink;
        }

        // Set HTML to live HTML
        renderedPage.html = renderedPage.liveHtml;

        var answer = { page: renderedPage };

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
                var html = Meteor.call('renderHeader', { brandId: page.brandId, lead: true, pageTitle: page.name, pageId: page._id });
            } else {
                var html = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name, pageId: page._id });
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
