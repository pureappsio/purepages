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

        if (this.image) {
            brand.image = this.image
        }

        if (Session.get('fileId')) {
            brand.image = Session.get('fileId');
        }

        // Cart & list
        brand.cartId = $('#cart-id :selected').val();
        brand.listId = $('#email-list :selected').val();

        // Save
        Meteor.call('editBrand', brand);

    }

});

Template.brandEdit.onRendered(function() {

    // Set session to false
    Session.set('fileId', false);

    // Init lists
    Meteor.call('getCartIntegrations', function(err, integrations) {

        $('#cart-id').empty();

        for (i = 0; i < integrations.length; i++) {
            $('#cart-id').append($('<option>', {
                value: integrations[i]._id,
                text: integrations[i].url
            }));
        }

        $('#cart-id').val(this.data.cartId);

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

        $('#email-list').val(this.data.listId);

    });

});
