import Images from '../imports/api/files';

var country = require('countryjs');

Meteor.methods({

    getWebinarPageData: function(page, query, headers) {

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get URL
        var absoluteURL = Meteor.absoluteUrl();

        // Get instances
        var instances = Meteor.call('getWebinarInstances', page.webinarId);

        for (i in instances) {
            instances[i].date = moment(instances[i].date).format('MMMM Do YYYY, h:mm a');
        }

        // var timezones = country.info(query.location).timezones;

        var timezone = Meteor.call('getTimezone', headers);
        console.log(timezone);

        // Helpers
        helpers = {
            langEN: function() {
                var brand = Brands.findOne(this.brandId);

                if (brand.language) {
                    if (brand.language == 'fr') {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            },

            timezone: function() {

                return timezone;

            },
            instances: function() {

                return instances;

            },
            emailAppUrl: function() {
                return Integrations.findOne({ type: 'puremail' }).url;
            },

            meteorURL: function() {
                return absoluteURL;
            },
            brandPicture: function() {

                var brand = Brands.findOne(page.brandId);
                return Images.findOne(brand.image).link();
            },

            listId: function() {
                return brand.listId;
            }

        };

        return helpers;

    }

});
