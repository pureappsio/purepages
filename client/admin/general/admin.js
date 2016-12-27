Template.admin.rendered = function() {

    // Default view
    if (!Session.get('view')) {
        Session.set('view', 'brand');
    }

    // Init lists
    Meteor.call('getCartIntegrations', function(err, integrations) {

        $('#cart-id').empty();

        for (i = 0; i < integrations.length; i++) {
            $('#cart-id').append($('<option>', {
                value: integrations[i]._id,
                text: integrations[i].url
            }));
        }

    });

    // Init lists
    Meteor.call('getEmailLists', function(err, lists) {

        $('#email-list').empty();

        for (i = 0; i < lists.length; i++) {
            $('#email-list').append($('<option>', {
                value: lists[i]._id,
                text: lists[i].name
            }));
        }

    });


}

Template.admin.events({

    'click #copy-page': function() {

        // Insert Metas
        Meteor.call('copyPage', {
            originPageId: $('#origin-page').val(),
            targetTitle: $('#target-page-title').val(),
            targetUrl: $('#target-page-url').val()
        });

    },

    'change #page-type, click #page-type': function() {

        // Get selection
        var brandId = $('#brand-id :selected').val();

        // Init sequence
        Meteor.call('getBrandDetails', brandId, function(err, brand) {

            // Check selection
            if ($('#page-type :selected').val() == 'leadgen') {

                Meteor.call('getListSequences', brand.listId, function(err, sequences) {

                    $('#parameter-id').empty();

                    for (i = 0; i < sequences.length; i++) {
                        $('#parameter-id').append($('<option>', {
                            value: sequences[i]._id,
                            text: sequences[i].name
                        }));
                    }

                });

            }
            if ($('#page-type :selected').val() == 'salespage' || $('#page-type :selected').val() == 'tripwire') {

                Meteor.call('getCartProducts', brand.cartId, function(err, products) {

                    $('#parameter-id').empty();

                    for (i = 0; i < products.length; i++) {
                        $('#parameter-id').append($('<option>', {
                            value: products[i]._id,
                            text: products[i].name
                        }));
                    }

                });

            }

        });


    },

    'click #create-page': function() {

        var page = {
            name: $('#page-name').val(),
            url: $('#page-url').val(),
            model: $('#page-type :selected').val(),
            brandId: $('#brand-id :selected').val(),
            userId: Meteor.user()._id
        }

        if (this.model == 'salespage' || this.model == 'tripwire') {
            page.sequenceId = $('#parameter-id :selected').val();
        } else {
            page.productId = $('#parameter-id :selected').val();
        }

        Meteor.call('createPage', page);

    },
    'click #create-brand': function() {

        var brand = {
            name: $('#brand-name').val(),
            listId: $('#email-list :selected').val(),
            image: Session.get('fileId'),
            userId: Meteor.user()._id,
            cartId: $('#cart-id :selected').val()
        }

        Meteor.call('createBrand', brand);

    },
    'click #generate-key': function() {

        Meteor.call('generateApiKey');
    },

    'click .section-selector': function(event) {

        Session.set('view', event.target.id);

    },
    'click #add-integration': function() {

        var accountData = {
            type: $('#integration-type :selected').val(),
            key: $('#integration-key').val(),
            url: $('#integration-url').val(),
            userId: Meteor.user()._id
        };
        Meteor.call('addIntegration', accountData);

    },
    'click #flush-cache': function() {

        Meteor.call('flushCache');

    },
    'click #save-pixel': function() {
        Meteor.call('saveFacebookPixel', $('#pixel-id').val());
    }

});

Template.admin.helpers({

    showSection: function(section) {
        if (Session.get('view') == section) {
            return true;
        }
    },
    integrations: function() {
        return Integrations.find({});
    },
    pages: function() {
        return Pages.find({});
    },
    brands: function() {
        return Brands.find({});
    },
    key: function() {
        return Meteor.user().apiKey;
    },
    pixel: function() {
        return Meteor.user().pixelId;
    }

});
