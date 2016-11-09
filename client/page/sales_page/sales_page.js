Template.salesPage.onRendered(function() {

    // fbq('track', 'Lead');

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
    Meteor.call('getProductData', this.data._id, function(err, data) {

        // Set product data
        $('.sales-product-name').text(data.name);
        $('.sales-price').text('$' + (data.price.USD).toFixed(2));
        $('.sales-price-display').text('$' + (data.price.USD).toFixed(2));

    });

});

Template.salesPage.helpers({

    // imageLink: function() {
    //     if (this.message.image) {
    //         return Images.findOne(this.message.image).link();
    //     }
    // },
    brandPicture: function() {

        var brand = Brands.findOne(this.brandId);
        return Images.findOne(brand.image).link();
    },
    includedElements: function() {
        return Elements.find({ type: 'included', pageId: this._id });
    },
    benefitElements: function() {
        return Elements.find({ type: 'benefit', pageId: this._id });
    },
    moduleElements: function() {
        return Elements.find({ type: 'module', pageId: this._id });
    },
    bonusElements: function() {
        return Elements.find({ type: 'bonus', pageId: this._id });
    },
    faqElements: function() {
        return Elements.find({ type: 'faq', pageId: this._id });
    },
    whoElements: function() {
        return Elements.find({ type: 'who', pageId: this._id });
    },
    paymentElements: function() {
        return Elements.find({ type: 'payment', pageId: this._id });
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
