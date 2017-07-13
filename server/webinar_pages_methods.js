import Images from '../imports/api/files';

Meteor.methods({

    getWebinarPageData: function(page, query) {

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get URL
        var absoluteURL = Meteor.absoluteUrl();

        // Helpers
        helpers = {

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
