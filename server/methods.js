import Images from '../imports/api/files';

Meteor.methods({

    removeTripwireVideo: function(pageId) {

        Pages.update(pageId, { $unset: { 'header.video': "" } });
        Pages.update(pageId, { $set: { cached: false } });

        console.log(Pages.findOne(pageId));

    },
    convertSessions: function() {

        var sessions = Sessions.find({}).fetch();

        for (i in sessions) {
            var newDate = new Date(sessions[i].date);
            Sessions.update(sessions[i]._id, { $set: { date: newDate } });
            console.log(Sessions.findOne(sessions[i]._id));
        }

    },
    getSessions: function(pageId, type) {

        var now = new Date();
        var limitDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

        return Sessions.aggregate(
            [
                { $match: { date: { $gte: limitDate }, pageId: pageId, type: type } }, {
                    $group: {
                        _id: {
                            "year": {
                                "$substr": ["$date", 0, 4]
                            },
                            "month": {
                                "$substr": ["$date", 5, 2]
                            },
                            "day": {
                                "$substr": ["$date", 8, 2]
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

    },
    getGraphSessions: function(pageId, type) {

        var sessions = Meteor.call('getSessions', pageId, type);

        data = [];

        for (i in sessions) {

            dataPoint = {};

            dataPoint.y = parseInt(sessions[i].count);
            var date = sessions[i]._id.year + '-' + sessions[i]._id.month + '-' + sessions[i]._id.day;
            dataPoint.x = new Date(date);

            data.push(dataPoint);

        }

        // Sort
        data.sort(date_sort);

        return data;

    },
    getGraphData: function(pageId, type) {

        var visits = Meteor.call('getGraphSessions', pageId, 'visit');
        var clicks = Meteor.call('getGraphSessions', pageId, 'click');

        console.log(visits);

        // // Adjust clicks on visits
        // for (i in visits.dates) {

        //     if (clicks.dates[i]) {
        //         if (visits.dates[i].getTime() != clicks.dates[i].getTime()) {
        //             console.log('Splicing');
        //             clicks.dates.splice(i, 0, visits.dates[i]);
        //             clicks.values.splice(i, 0, 0);
        //         }
        //     } else {

        //         console.log('Adding missing value');
        //         clicks.dates.push(visits.dates[i]);
        //         clicks.values.push(0);

        //     }

        // }

        if (type == 'conversion') {

            var conversions = [];

            for (i in visits) {

                for (j in clicks) {

                    if (clicks[j].x.getTime() == visits[i].x.getTime()) {

                        dataPoint = {
                            y: (clicks[j].y / visits[i].y * 100).toFixed(2),
                            x: clicks[j].x
                        }
                        conversions.push(dataPoint);

                    }
                }

            }

            conversions.sort(date_sort);

            var data = {
                labels: visits.dates,
                datasets: [{
                    label: "Conversions",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "orange",
                    borderColor: "orange",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "orange",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "orange",
                    pointHoverBorderColor: "orange",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: conversions,
                    spanGaps: false,
                }]
            }
        }

        if (type == 'trend') {

            var data = {
                datasets: [{
                    label: 'Sessions',
                    fill: false,
                    data: visits,
                    pointHoverBackgroundColor: "darkblue",
                    pointHoverBorderColor: "darkblue",
                    pointBorderColor: "darkblue",
                    backgroundColor: "darkblue",
                    borderColor: "darkblue"
                }, {
                    label: 'Clicks',
                    fill: false,
                    data: clicks,
                    pointHoverBackgroundColor: "red",
                    pointHoverBorderColor: "red",
                    pointBorderColor: "red",
                    backgroundColor: "red",
                    borderColor: "red"
                }]
            };
        }

        return data;

    },
    insertSession: function(session) {

        console.log(session);
        Sessions.insert(session);

    },
    getUserLocation: function(httpHeaders) {

        // console.log(httpHeaders);

        if (httpHeaders['cf-ipcountry']) {
            // console.log('Using CloudFlare location')
            var data = {};
            country_code = httpHeaders['cf-ipcountry'];
        } else {
            // console.log('Using direct IP location')
            country_code = 'US';
        }

        return country_code;

    },

    getUSDLocations: function() {

        return ['US', 'CA', 'AU', 'NZ'];

    },
    getDiscount: function(code, brandId) {

        // Get brand
        var brand = Brands.findOne(brandId);

        // Get integration
        if (Integrations.findOne(brand.cartId)) {

            var integration = Integrations.findOne(brand.cartId);

            // Get lists
            var url = "https://" + integration.url + "/api/discounts/" + code + "?key=" + integration.key;

            try {
                var answer = HTTP.get(url);
                return answer.data;
            } catch (e) {
                return {};
            }

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
    setElementIcon: function(icon, elementId) {

        console.log(icon);

        Elements.update(elementId, { $set: { icon: icon } });

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

        // Order
        var order = Elements.find({ type: element.type, pageId: element.pageId }).fetch().length + 1;
        element.number = order;

        console.log(element);

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

            var answer = HTTP.post(url, { data: data });

        }

    },
    getEmailLists: function() {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "https://" + integration.url + "/api/lists?key=" + integration.key;

            try {

                var answer = HTTP.get(url);
                return answer.data.lists;

            } catch (e) {
                return [];
            }

        } else {
            return [];
        }

    },
    getCourses: function(integrationId) {

        if (Integrations.findOne(integrationId)) {

            var integration = Integrations.findOne(integrationId);

            // Get lists
            var url = "https://" + integration.url + "/api/courses?key=" + integration.key;
            console.log(url);

            try {

                var answer = HTTP.get(url);
                console.log(answer.data.courses);
                return answer.data.courses;

            } catch (e) {
                console.log(e);
                return [];
            }

        } else {
            return [];
        }

    },
    getModules: function(courseId, integrationId) {

        // Get integration
        if (Integrations.findOne(integrationId)) {

            var integration = Integrations.findOne(integrationId);

            // Get module
            var url = "https://" + integration.url + "/api/modules?key=" + integration.key;
            url += '&course=' + courseId;
            url += '&lessons=all';
            console.log(url);

            try {

                var answer = HTTP.get(url);
                return answer.data.modules;

            } catch (e) {
                console.log(e);
                return [];
            }

        } else {
            return [];
        }

    },
    getLessons: function(moduleId) {

        // Get integration
        if (Integrations.findOne({ type: 'purecourses' })) {

            var integration = Integrations.findOne({ type: 'purecourses' });

            // Get lists
            var url = "https://" + integration.url + "/api/lessons?key=" + integration.key;
            url += '&module=' + moduleId;

            try {

                var answer = HTTP.get(url);
                return answer.data.lessons;

            } catch (e) {
                return [];
            }

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

            try {
                var answer = HTTP.get(url);
                return answer.data.products;

            } catch (e) {
                return [];
            }

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
        url += '&variants=true';

        try {
            var answer = HTTP.get(url);
            return answer.data.product;
        } catch (e) {
            console.log(e);
            return {};
        }

    },
    getProductVariants: function(pageId) {

        // Get page
        var page = Pages.findOne(pageId);

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get integration
        var integration = Integrations.findOne(brand.cartId);

        // Get product data
        var url = "https://" + integration.url + "/api/variants?key=" + integration.key;
        url += '&product=' + page.productId;

        try {
            var answer = HTTP.get(url);
            return answer.data.variants;
        } catch (e) {
            return [];
        }

    },
    getListSequences: function(list) {

        // Get integration
        if (Integrations.findOne({ type: 'puremail' })) {

            var integration = Integrations.findOne({ type: 'puremail' });

            // Get lists
            var url = "https://" + integration.url + "/api/sequences?key=" + integration.key;
            url += '&list=' + list;

            try {
                var answer = HTTP.get(url);
                return answer.data.sequences;
            } catch (e) {
                return [];
            }

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

            try {
                var answer = HTTP.get(url);
                return answer.data.tags;
            } catch (e) {
                return [];
            }

        } else {
            return [];
        }

    },

    editPage: function(page) {

        console.log(page);

        // Update
        Pages.update(page._id, page);
        Pages.update(page._id, { $set: { cached: false } });

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

function date_sort(a, b) {
    return new Date(a.x).getTime() - new Date(b.x).getTime();
}
