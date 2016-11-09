Meteor.methods({

    redirectCheckout: function(pageId) {

        // Get page
        var page = Pages.findOne(pageId);

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get integration
        var integration = Integrations.findOne(brand.cartId);

        return 'https://' + integration.url + '?product_id=' + page.productId;

    },
    getCartIntegrations: function() {

        return Integrations.find({ type: 'purecart' }).fetch();

    },
    createElement: function(element) {

        Elements.insert(element);

    },

    removeElement: function(elementId) {

        Elements.remove(elementId);

    },
    optIn: function(data, integration) {

        // Make request
        var answer = HTTP.post("https://" + integration.url + "/subscribe", { data: data });

        // Redirect
        return answer.headers.location;

    },
    getEmailIntegration() {

        if (Integrations.findOne({ type: 'puremail' })) {
            return Integrations.findOne({ type: 'puremail' });
        }

    },
    createBrand: function(brand) {

        Brands.insert(brand);

    },

    editBrand: function(brand) {

        console.log(brand);

        Brands.update(brand._id, { $set: brand });

    },

    getBrandDetails: function(brandId) {

        return Brands.findOne(brandId);

    },
    removeBrand: function(brandId) {
        Brands.remove(brandId);
    },
    getEmailLists: function() {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "https://" + integration.url + "/api/lists?key=" + integration.key;
            var answer = HTTP.get(url);
            return answer.data.lists;

        } else {
            return [];
        }

    },

    getCartProducts: function(cartId) {

        // Get integration
        if (Integrations.findOne(cartId)) {

            var integration = Integrations.findOne(cartId);

            // Get products
            var url = "https://" + integration.url + "/api/products?key=" + integration.key;
            console.log(url);
            var answer = HTTP.get(url);
            return answer.data.products;

        } else {
            return [];
        }

    },
    getProductData: function(pageId) {

         // Get page
        var page = Pages.findOne(pageId);

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get integration
        var integration = Integrations.findOne(brand.cartId);

        // Get product data
        var url = "https://" + integration.url + "/api/products/"+ page.productId + "?key=" + integration.key;
        var answer = HTTP.get(url);
        return answer.data.product;

    },
    getListSequences: function(list) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "http://" + integration.url + "/api/sequences?key=" + integration.key;
            url += '&list=' + list;
            var answer = HTTP.get(url);
            return answer.data.sequences;

        } else {
            return [];
        }

    },

    editPage: function(page) {

        console.log(page);

        Pages.update(page._id, page);

    },
    createPage: function(page) {

        Pages.insert(page);

    },
    removePage: function(pageId) {

        Pages.remove(pageId);

    },
    getIntegrations: function() {

        return Integrations.find({}).fetch();

    },
    addIntegration: function(data) {

        // Insert
        Integrations.insert(data);

    },
    removeIntegration: function(data) {

        // Insert
        Integrations.remove(data);

    },
    validateApiKey: function(key) {

        var adminUser = Meteor.users.findOne({ apiKey: { $exists: true } });

        if (adminUser.apiKey == key) {
            return true;
        } else {
            return false;
        }

    },
    generateApiKey: function() {

        // Check if key exist
        if (!Meteor.user().apiKey) {

            // Generate key
            var key = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 16; i++) {
                key += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log(key);

            // Update user
            Meteor.users.update(Meteor.user()._id, { $set: { apiKey: key } });
        }

    },

});
