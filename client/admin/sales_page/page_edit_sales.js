Template.pageEditSales.helpers({

    image: function() {
        if (this.message) {
            if (this.message.image) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    imageLink: function() {
        if (this.message) {
            if (this.message.image) {
                return Images.findOne(this.message.image).link();
            }
        }

    },
    brands: function() {
        return Brands.find({});
    },
    includedElements: function() {
        return Elements.find({ type: 'included', pageId: this._id }, { sort: { number: 1 } });
    },
    benefitElements: function() {
        return Elements.find({ type: 'benefit', pageId: this._id }, { sort: { number: 1 } });
    },
    moduleElements: function() {
        return Elements.find({ type: 'module', pageId: this._id }, { sort: { number: 1 } });
    },
    bonusElements: function() {
        return Elements.find({ type: 'bonus', pageId: this._id }, { sort: { number: 1 } });
    },
    whoElements: function() {
        return Elements.find({ type: 'who', pageId: this._id }, { sort: { number: 1 } });
    },
    faqElements: function() {
        return Elements.find({ type: 'faq', pageId: this._id }, { sort: { number: 1 } });
    },
    paymentElements: function() {
        return Elements.find({ type: 'payment', pageId: this._id }, { sort: { number: 1 } });
    }

});

Template.pageEditSales.events({

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

    'click #add-element-included': function() {

        var element = {
            type: 'included',
            content: $('#included-element-content').val(),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-benefit': function() {

        var element = {
            type: 'benefit',
            content: $('#benefit-element-content').val(),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-module': function() {

        var element = {
            type: 'module',
            title: $('#module-element-title').val(),
            content: $('#module-element-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-bonus': function() {

        var element = {
            type: 'bonus',
            title: $('#bonus-element-title').val(),
            content: $('#bonus-element-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-payment': function() {

        var element = {
            type: 'payment',
            content: $('#payment-element-content').val(),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-who': function() {

        var element = {
            type: 'who',
            content: $('#who-element-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #add-element-faq': function() {

        var element = {
            type: 'faq',
            title: $('#faq-element-title').val(),
            content: $('#faq-element-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
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
            theme: $('#theme :selected').val()
        }

        // Brand
        page.brandId = $('#brand-id :selected').val();

        // Product
        page.productId = $('#product-id :selected').val();

        // Header
        page.header = {};
        page.header.title = $('#header-title').val();
        if (this.header) {
            if (this.header.image) {
                page.header.image = this.header.image;
            }
        }
        if (Session.get('header')) {
            page.header.image = Session.get('header');
        }

        // What
        page.what = {};
        page.what.title = $('#what-title').val();
        page.what.text = $('#what-text').summernote('code');

        // Included
        page.included = {};
        page.included.title = $('#included-title').val();
        page.included.text = $('#included-text').summernote('code');

        // Benefits
        page.benefits = {};
        page.benefits.title = $('#benefits-title').val();
        page.benefits.text = $('#benefits-text').summernote('code');

        // Modules
        page.modules = {};
        page.modules.title = $('#modules-title').val();
        if (this.modules) {
            if (this.modules.image) {
                page.modules.image = this.modules.image;
            }
        }
        if (Session.get('modules')) {
            page.modules.image = Session.get('modules');
        }

        // Bonuses
        page.bonuses = {};
        page.bonuses.title = $('#bonuses-title').val();

        // Who
        page.who = {};
        page.who.title = $('#who-title').val();

        // Message
        page.message = {};
        page.message.text = $('#message-text').summernote('code');

        // FAQ
        page.faq = {};
        page.faq.title = $('#faq-title').val();

        // Get Started
        page.started = {};
        page.started.title = $('#started-title').val();
        page.started.text = $('#started-text').summernote('code');

        // Payment
        page.payment = {};
        if (this.payment) {
            if (this.payment.image) {
                page.payment.image = this.payment.image;
            }
        }
        if (Session.get('payment')) {
            page.payment.image = Session.get('payment');
        }

        // Timer
        page.timer = {};
        page.timer.active = $('#timer-active :selected').val();
        page.timer.text = $('#timer-text').val();
        page.timer.date = $('#timer-date').val();
        page.timer.page = $('#timer-page :selected').val();

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditSales.onRendered(function() {

    // Countdown
    $('.datetimepicker').datetimepicker();

    // Set session to false
    Session.set('fileId', false);

    // Init editor
    $('#what-text').summernote({
        height: 150 // set editor height
    });

    $('#included-text').summernote({
        height: 150 // set editor height
    });

    $('#benefits-text').summernote({
        height: 150 // set editor height
    });

    $('#message-text').summernote({
        height: 150 // set editor height
    });

    $('#started-text').summernote({
        height: 150 // set editor height
    });

    $('#module-element-content').summernote({
        height: 150 // set editor height
    });

    $('#who-element-content').summernote({
        height: 150 // set editor height
    });

    $('#bonus-element-content').summernote({
        height: 150 // set editor height
    });

    $('#faq-element-content').summernote({
        height: 150 // set editor height
    });

    if (this.data.what) {
        if (this.data.what.text) {
            $('#what-text').summernote('code', this.data.what.text);
        }
    }

    if (this.data.included) {
        if (this.data.included.text) {
            $('#included-text').summernote('code', this.data.included.text);
        }
    }

    if (this.data.benefits) {
        if (this.data.benefits.text) {
            $('#benefits-text').summernote('code', this.data.benefits.text);
        }
    }

    if (this.data.message) {
        if (this.data.message.text) {
            $('#message-text').summernote('code', this.data.message.text);
        }
    }

    if (this.data.started) {
        if (this.data.started.text) {
            $('#started-text').summernote('code', this.data.started.text);
        }
    }

    if (this.data.timer) {
        $('#timer-active').val(this.data.timer.active);
    }

    // Load pages
    if (this.data.timer) {
        timerPage = this.data.timer.page;
    }
    Meteor.call('getBrandPages', this.data.brandId, function(err, pages) {

        $('#timer-page').empty();

        for (i = 0; i < pages.length; i++) {
            $('#timer-page').append($('<option>', {
                value: pages[i]._id,
                text: pages[i].name
            }));
        }

        if (timerPage) {
            $('#timer-page').val(timerPage);
        }

    });

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

});
