import Images from '../imports/api/files';

Meteor.methods({

    calculateSalesPrice: function(productData, discount, currency) {

        if (currency == 'USD') {
            var price = parseFloat(productData.price.USD);
        } else {
            var price = parseFloat(productData.price.EUR);
        }

        if (discount.type == 'amount') {
            price = price - parseInt(discount.amount);
        } else {
            price = price * (1 - parseInt(discount.amount) / 100);
        }

        if (currency == 'USD') {
            price = '$' + price.toFixed(2);
        } else {
            price = price.toFixed(2) + ' €';
        }

        return price;

    },
    calculateBasePrice: function(productData, discount, currency) {

        if (discount.useDiscount == false) {
            if (productData.basePrice) {
                var price = parseFloat(productData.basePrice[currency]);
            }
            else {
                var price = parseFloat(productData.price[currency]);
            }
        }
        else {
            var price = parseFloat(productData.price[currency]);
        }

        if (currency == 'USD') {
            price = '$' + price.toFixed(2);
        } else {
            price = price.toFixed(2) + ' €';
        }

        return price;

    },
    getDiscountData: function(page, query) {

        discount = {
            useDiscount: false,
            amount: 0,
            type: 'percent'
        };

        var brand = Brands.findOne(page.brandId);

        if (query.subscriber) {

            // Get offers
            offers = Meteor.call('getOffers', query.subscriber);

            // Check if offer match product
            var offerFound = false;
            for (o in offers) {
                if (offers[o].productId == page.productId) {
                    console.log('Offer found');
                    offerFound = true;
                    var offer = offers[o];
                }
            }

            if (offerFound) {
                if (parseInt(offer.offerDiscount) != 0) {

                    // Generate code
                    var discountCode = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

                    for (var i = 0; i < 7; i++) {
                        discountCode += possible.charAt(Math.floor(Math.random() * possible.length));
                    }

                    discountData = {
                        code: discountCode,
                        name: 'Offer Discount',
                        amount: offer.offerDiscount,
                        type: 'percent'
                    }

                    // Create discount
                    Meteor.call('createDiscount', discountData, brand.cartId);

                    discount.useDiscount = true;
                    discount.amount = offer.offerDiscount;
                    discount.type = 'percent';
                    discount.code = discountCode;

                }
            }

        }

        if (query.discount) {

            // Verify discount
            verifiedDiscount = Meteor.call('getDiscount', query.discount, page.brandId);

            if (verifiedDiscount._id) {
                // Discount
                discount.useDiscount = true;
                discount.amount = verifiedDiscount.amount;
                discount.type = verifiedDiscount.type;
                discount.code = query.discount;

                // Check expiry date
                if (verifiedDiscount.expiryDate) {

                    // Date
                    var currentDate = new Date();
                    var expiryDate = new Date(verifiedDiscount.expiryDate);

                    if (currentDate.getTime() - expiryDate.getTime() > 0) {
                        discount.useDiscount = false;
                        discount.amount = 0;
                    }

                }
            }

        }

        return discount;

    },
    getTimerData: function(page, query) {

        timer = {
            useTimer: false
        }

        if (page.timer) {

            if (page.timer.active == 'yes') {

                timer.useTimer = true;

                // Date
                var currentDate = new Date();
                timer.expiryDate = new Date(page.timer.date);

                if (currentDate.getTime() - timer.expiryDate.getTime() > 0) {
                    timer.timerExpired = true;
                }

            }

        }

        if (query.subscriber) {

            // Get offers
            offers = Meteor.call('getOffers', query.subscriber);
            console.log(offers);

            // Check if offer match product
            var offerFound = false;
            for (o in offers) {
                if (offers[o].productId == page.productId) {
                    console.log('Offer found');
                    offerFound = true;
                    var offer = offers[o];
                }
            }

            if (offerFound) {

                // Use timer
                timer.useTimer = true;

                // Date
                var currentDate = new Date();
                timer.expiryDate = new Date(offer.expiryDate);

                if (currentDate.getTime() - timer.expiryDate.getTime() > 0) {
                    timer.timerExpired = true;
                }

            }

        }

        if (query.discount) {

            // Verify discount
            discount = Meteor.call('getDiscount', query.discount, page.brandId);
            console.log(discount);

            if (discount._id) {

                console.log('Valid discount code')

                if (discount.expiryDate) {

                    // Date
                    var currentDate = new Date();
                    timer.expiryDate = new Date(discount.expiryDate);

                    timer.timerExpired = false;

                    if (currentDate.getTime() - timer.expiryDate.getTime() > 0) {
                        timer.useTimer = false;
                    } else {
                        timer.useTimer = true;
                    }

                } else {

                    timer.useTimer = false;
                    timer.timerExpired = false;

                }

            } else if (discount.message == 'Discount expired') {
                timer.useTimer = false;
                timer.timerExpired = false;
            }

        }

        console.log(timer);

        return timer;

    }

});
