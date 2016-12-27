Template.leadGen.onRendered(function() {

    fbq('track', 'Lead');

});

Template.leadGen.helpers({

    imageLink: function() {
        if (this.message.image) {
            return Images.findOne(this.message.image).link();
        }
    },
    brandPicture: function() {

        var brand = Brands.findOne(this.brandId);
        return Images.findOne(brand.image).link();
    },
     elements: function() {
        return Elements.find({pageId: this._id});
    }

});

Template.leadGen.events({

    'click #submit': function() {

        // Get sequence
        var sequenceId = this.sequenceId;

        if ($('#email').val() != "") {

            // Get brand data
            Meteor.call('getBrandDetails', this.brandId, function(err, brand) {

                // Collect data
                var data = {
                    email: $('#email').val(),
                    list: brand.listId,
                    sequence: sequenceId,
                    origin: 'landing'
                }

                // Get integration
                Meteor.call('getEmailIntegration', function(err, integration) {

                    // Make request
                    Meteor.call('optIn', data, integration, function(err, redirectUrl) {
                        window.top.location.href = redirectUrl; 
                    });

                });

            });

        }

    }

});
