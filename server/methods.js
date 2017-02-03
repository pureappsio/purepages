Meteor.methods({

    getDiscount: function(code, brandId) {

        // Get brand
        var brand = Brands.findOne(brandId);

        // Get integration
        if (Integrations.findOne(brand.cartId)) {

            var integration = Integrations.findOne(brand.cartId);

            // Get lists
            var url = "https://" + integration.url + "/api/discounts/" + code + "?key=" + integration.key;
            var answer = HTTP.get(url);

            return answer.data;

        }

    },
    copyPage: function(data) {

        // Get page
        var page = Pages.findOne(data.originPageId);

        // Get all elements linked to page
        var elements = Elements.find({ pageId: page._id }).fetch();

        // Create new page
        page.url = data.targetUrl;
        page.name = data.targetTitle;
        delete page._id;

        // Insert
        var pageId = Pages.insert(page);

        // Create copy of elements
        for (i in elements) {

            var element = elements[i];
            element.pageId = pageId;
            delete element._id;

            Elements.insert(element)
        }

    },

    getBrandPages: function(brandId) {

        return Pages.find({ brandId: brandId }).fetch();

    },
    getBrandLanguage: function(brandId) {

        // Get brand
        var brand = Brands.findOne(brandId);

        if (brand.language) {
            return brand.language;
        } else {
            return 'en';
        }

    },
    setElementNumber: function(number, elementId) {

        console.log(number);

        Elements.update(elementId, { $set: { number: number } });

    },
    setElementTitle: function(title, elementId) {

        console.log(title);

        Elements.update(elementId, { $set: { title: title } });

    },
    setElementContent: function(content, elementId) {

        console.log(content);

        Elements.update(elementId, { $set: { content: content } });

    },
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

        Meteor.call('flushCache');

        Elements.insert(element);

    },

    removeElement: function(elementId) {

        Meteor.call('flushCache');

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

        Meteor.call('flushCache');

    },

    getBrandDetails: function(brandId) {

        return Brands.findOne(brandId);

    },
    removeBrand: function(brandId) {
        Brands.remove(brandId);
    },
    createDiscount: function(data, integrationId) {

        // Get integration
        if (Integrations.findOne(integrationId)) {

            var integration = Integrations.findOne(integrationId);

            // Get lists
            var url = "https://" + integration.url + "/api/discounts?key=" + integration.key;
            // console.log(url);
            var answer = HTTP.post(url, { data: data });
            // console.log(answer);

        }

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
    getSubscriber: function(subscriberId) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "https://" + integration.url + "/api/subscribers/" + subscriberId;
            url += "?key=" + integration.key;
            var answer = HTTP.get(url);
            return answer.data;

        } else {
            return {};
        }

    },
    getOffers: function(subscriberId) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "https://" + integration.url + "/api/offers";
            url += "?key=" + integration.key + '&subscriber=' + subscriberId;
            var answer = HTTP.get(url);
            return answer.data.offers;

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
        var url = "https://" + integration.url + "/api/products/" + page.productId + "?key=" + integration.key;
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

    getListTags: function(list) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "http://" + integration.url + "/api/tags?key=" + integration.key;
            url += '&list=' + list;
            var answer = HTTP.get(url);
            return answer.data.tags;

        } else {
            return [];
        }

    },

    editPage: function(page) {

        console.log(page);

        Pages.update(page._id, page);

        Meteor.call('flushCache');

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
        } else {
            console.log('API key already generated');
        }

    },
    saveFacebookPixel: function(pixel) {

        // Update user
        Meteor.users.update(Meteor.user()._id, { $set: { pixelId: pixel } });

    },
    getFacebookPixel: function() {
        return Meteor.users.findOne({ pixelId: { $exists: true } }).pixelId;
    }

});
