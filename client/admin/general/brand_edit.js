Template.brandEdit.helpers({

    image: function() {
        if (this.image) {
            return true;
        } else {
            return false;
        }

    },
    imageLink: function() {
        if (this.image) {
            return Images.findOne(this.image).link();
        }

    },
    logo: function() {
        if (this.logo) {
            return true;
        } else {
            return false;
        }

    },
    logoLink: function() {
        if (this.logo) {
            return Images.findOne(this.logo).link();
        }

    }

});

Template.brandEdit.events({

    'click #save-brand': function() {

        // Base parameters
        var brand = {
            name: this.name,
            listId: this.listId,
            userId: this.userId,
            _id: this._id,
        }

        // Name
        brand.name = $('#brand-name').val();

        // Image
        if (this.image) {
            brand.image = this.image
        }

        if (Session.get('fileId')) {
            brand.image = Session.get('fileId');
        }

        // Logo
        if (this.logo) {
            brand.logo = this.logo
        }

        if (Session.get('logo')) {
            brand.logo = Session.get('logo');
        }

        // Cart & list
        brand.cartId = $('#cart-id :selected').val();
        brand.listId = $('#email-list :selected').val();

        // Language
        brand.language = $('#language :selected').val();

        // Tracking ID
        brand.trackingId = $('#tracking-id').val();

        // Save
        Meteor.call('editBrand', brand);

    }

});

Template.brandEdit.onRendered(function() {

    // Set session to false
    Session.set('fileId', false);

    // Init data
    if (this.data.cartId) {
        var cartId = this.data.cartId;
    }

    if (this.data.listId) {
        var listId = this.data.listId;
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

        $('#cart-id').val(cartId);

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

        $('#email-list').val(listId);

    });

});
