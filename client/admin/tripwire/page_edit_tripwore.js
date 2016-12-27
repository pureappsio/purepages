Template.pageEditTripwire.helpers({

    // image: function() {
    //     if (this.main) {
    //         if (this.main.image) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     } else {
    //         return false;
    //     }

    // },
    // imageLink: function() {
    //     if (this.main) {
    //         if (this.main.image) {
    //             return Images.findOne(this.main.image).link();
    //         }
    //     }

    // },
    brands: function() {
        return Brands.find({});
    },
    elements: function(type) {
        return Elements.find({ pageId: this._id, type: type });
    }

});

Template.pageEditTripwire.events({

     'change #brand-id, click #page-type': function() {

        // Get selection
        var brandId = $('#brand-id :selected').val();

        // Init sequence
        Meteor.call('getBrandDetails', brandId, function(err, brand) {


            Meteor.call('getCartProducts', brand.cartId, function(err, products) {

                $('#product-id').empty();

                for (i = 0; i < products.length; i++) {
                    $('#product-id').append($('<option>', {
                        value: products[i]._id,
                        text: products[i].name
                    }));
                }

            });

        });


    },

    'click #add-element-what': function() {

        var element = {
            title: $('#element-title-what').val(),
            content: $('#element-content-what').val(),
            pageId: this._id,
            userId: Meteor.user()._id,
            type: 'what'
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-inside': function() {

        var element = {
            title: $('#element-title-inside').val(),
            content: $('#element-content-inside').val(),
            pageId: this._id,
            userId: Meteor.user()._id,
            type: 'inside'
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-faq': function() {

        var element = {
            title: $('#element-title-faq').val(),
            content: $('#element-content-faq').val(),
            pageId: this._id,
            userId: Meteor.user()._id,
            type: 'faq'
        }

        Meteor.call('createElement', element);

    },
    'click #save-page': function() {

        // Base parameters
        var page = {
            name: this.name,
            url: this.url,
            model: this.model,
            userId: this.userId,
            _id: this._id,
        }

        // Brand
        page.brandId = $('#brand-id :selected').val();

        // Product
        page.productId = $('#product-id :selected').val();

        // Header
        page.header = {};
        page.header.title = $('#header-title').val();

        // Main
        page.main = {};
        page.main.title = $('#main-title').val();
        page.main.text = $('#main-text').summernote('code');

        // What
        page.what = {};
        page.what.title = $('#what-title').val();

        // Inside
        page.inside = {};
        page.inside.title = $('#inside-title').val();

        // Message
        page.message = {};
        page.message.text = $('#message-text').summernote('code');
        page.message.signature = $('#message-signature').summernote('code');

        if (this.message) {
            if (this.message.image) {
                page.message.image = this.message.image;
            }
        }

        if (Session.get('message')) {
            page.message.image = Session.get('message');
        }

        // Bottom
        page.bottom = {};
        page.bottom.text = $('#bottom-text').val();

        if (Session.get('main')) {
            page.main.image = Session.get('main');
        }

        if (this.main) {
            if (this.main.image) {
                page.main.image = this.main.image;
            }
        }

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditTripwire.onRendered(function() {

    // Init product
    var productId = this.data.productId;
    if (this.data.brandId) {

        // Set brand
        $("#brand-id").val(this.data.brandId);

        Meteor.call('getBrandDetails', this.data.brandId, function(err, brand) {

            Meteor.call('getCartProducts', brand.cartId, function(err, products) {

                $('#product-id').empty();

                for (i = 0; i < products.length; i++) {
                    $('#product-id').append($('<option>', {
                        value: products[i]._id,
                        text: products[i].name
                    }));
                }

                $('#product-id').val(productId);

            });

        });

    }

    // Set session to false
    Session.set('fileId', false);

    // Init editor
    $('#main-text').summernote({
        height: 150 // set editor height
    });

    if (this.data.main) {
        if (this.data.main.text) {
            $('#main-text').summernote('code', this.data.main.text);
        }
    }

    // Init editor
    $('#message-text').summernote({
        height: 150 // set editor height
    });

    if (this.data.message) {
        if (this.data.message.text) {
            $('#message-text').summernote('code', this.data.message.text);
        }
    }

    // Init editor
    $('#message-signature').summernote({
        height: 150 // set editor height
    });

    if (this.data.message) {
        if (this.data.message.signature) {
            $('#message-signature').summernote('code', this.data.message.signature);
        }
    }

});
