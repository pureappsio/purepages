Template.salesPage.onRendered(function() {

    // fbq('track', 'Lead');

    // Load theme
    if (this.data.theme) {

        console.log(this.data.theme);

        if (this.data.theme == 'green') {
            // Change background image
            $('.sales-who').css(
                'background-color',
                '#389839'
            );
        }

    }

    // Get main header image
    if (this.data.header.image) {
        // Change background image
        $('.sales-top-row').css(
            'background-image',
            'url(' + Images.findOne(this.data.header.image).link() + ')'
        );
    }

    // Get payment header image
    if (this.data.payment) {
        if (this.data.payment.image) {
            // Change background image
            $('.sales-payment').css(
                'background-image',
                'url(' + Images.findOne(this.data.payment.image).link() + ')'
            );
        }

    }

    // Get product data
    var brandId = this.data.brandId;
    Meteor.call('getProductData', this.data._id, function(err, data) {

        Meteor.call('getBrandLanguage', brandId, function(err, language) {

            // Set product data
            $('.sales-product-name').text(data.name);
            if (language == 'en') {
                $('.sales-price').text('$' + (data.price.USD).toFixed(2));
                $('.sales-price-display').text('$' + (data.price.USD).toFixed(2));
            } else {
                $('.sales-price').text((data.price.EUR).toFixed(2) + ' €');
                $('.sales-price-display').text((data.price.EUR).toFixed(2) + ' €');
            }

        });

    });

});

Template.salesPage.helpers({

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
    brandPicture: function() {

        var brand = Brands.findOne(this.brandId);
        return Images.findOne(brand.image).link();
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
    faqElements: function() {
        return Elements.find({ type: 'faq', pageId: this._id }, { sort: { number: 1 } });
    },
    whoElements: function() {
        return Elements.find({ type: 'who', pageId: this._id }, { sort: { number: 1 } });
    },
    paymentElements: function() {
        return Elements.find({ type: 'payment', pageId: this._id }, { sort: { number: 1 } });
    }


});

Template.salesPage.events({

    'click #checkout': function() {

        Meteor.call('redirectCheckout', this._id, function(err, redirectUrl) {

            // Do stuff
            window.top.location.href = redirectUrl;

        });

    }

});
