var cheerio = Npm.require("cheerio");
import Images from '../imports/api/files';
const qs = require('query-string');
// var URL = require('url');
var parse = require('url-parse');

Meteor.methods({

    processRendered: function(html, page, query) {

        var startProcess = new Date();

        // Load raw HTML
        $ = cheerio.load(html);

        // Set timer & discount
        var timer = Meteor.call('getTimerData', page, query);
        var discount = Meteor.call('getDiscountData', page, query);

        // Process links
        $('a').each(function(i, elem) {

            // Link
            var link = $(elem)[0].attribs.href;

            console.log(link);

            // Decode query
            var linkUrl = parse(link, true);
            parsedQuery = linkUrl.query;

            console.log(linkUrl);

            if (discount.useDiscount == true) {
                parsedQuery.discount = discount.code;
            }

            if (query.origin) {
                parsedQuery.origin = query.origin;
            }

            if (query.medium) {
                parsedQuery.medium = query.medium;
            }

            if (query.ref) {
                parsedQuery.ref = query.ref;
            }

            if (linkUrl.origin != 'null') {
                if (_.isEmpty(parsedQuery)) {
                    link = linkUrl.origin + linkUrl.pathname;
                } else {
                    link = linkUrl.origin + linkUrl.pathname + '?' + qs.stringify(parsedQuery);
                }
            }

            $(elem)[0].attribs.href = link;

        });

        // Process each page type
        if (page.model == 'leadgen') {

            if (query.origin) {
                $('#origin').val(query.origin);
            }

        }

        if (page.model == 'tripwire') {

            // Get location
            if (query.location) {
                var location = query.location;
            } else {
                var location = 'US';
            }
            var usdLocations = Meteor.call('getUSDLocations');

            // Get product data
            var productData = Meteor.call('getProductData', page._id);
            console.log(productData);

            // Sales price
            if (usdLocations.indexOf(location) != -1) {
                price = Meteor.call('calculateSalesPrice', productData, discount, 'USD');
            } else {
                price = Meteor.call('calculateSalesPrice', productData, discount, 'EUR');
            }

            $('.tripwire-sales-price').text(price);

            // if (usdLocations.indexOf(location) != -1) {
            //     price = Meteor.call('calculateBasePrice', productData, discount, 'USD');
            // } else {
            //     price = Meteor.call('calculateBasePrice', productData, discount, 'EUR');
            // }

            console.log(price);

            // // Apply discount
            // if (discount.useDiscount || productData.basePrice) {
            //     $('.tripwire-sales-price').addClass('reduced-price');
            // } else {
            //     $('.tripwire-base-sales-price').css("display", "none");
            // }

        }

        if (page.model == 'salespage') {

            // Get location
            if (query.location) {
                var location = query.location;
            } else {
                var location = 'US';
            }
            var usdLocations = Meteor.call('getUSDLocations');

            // Get product data
            var productData = Meteor.call('getProductData', page._id);
            console.log(productData);

            // Get variants
            var variants = productData.variants;

            // Product price
            if (variants.length > 0) {
                var productPrice = variants[0].price;
            } else {
                var productPrice = productData.price;
            }

            // Sales price
            if (usdLocations.indexOf(location) != -1) {
                price = Meteor.call('calculateSalesPrice', productData, discount, 'USD');
            } else {
                price = Meteor.call('calculateSalesPrice', productData, discount, 'EUR');
            }

            $('#bottom-sales-price').text(price);
            $('#middle-sales-price').text(price);

            // Base sale price
            if (variants.length > 0) {
                var productPrice = variants[0].price;
            } else {
                var productPrice = productData.price;
            }

            if (usdLocations.indexOf(location) != -1) {
                price = Meteor.call('calculateBasePrice', productData, discount, 'USD');
            } else {
                price = Meteor.call('calculateBasePrice', productData, discount, 'EUR');
            }

            console.log(price);

            $('#bottom-base-sales-price').text(price);
            $('#middle-base-sales-price').text(price);

            // Apply discount
            if (discount.useDiscount || productData.basePrice) {
                $('#bottom-sales-price').addClass('reduced-price');
                $('#middle-sales-price').addClass('reduced-price');
            } else {
                $('#bottom-base-sales-price').css("display", "none");
                $('#middle-base-sales-price').css("display", "none");
            }

            // Variants
            if (variants.length > 0) {

                $('.variant-base-price').each(function(i, elem) {

                    variant = variants[i];

                    console.log(elem);

                    // Base price
                    if (usdLocations.indexOf(location) != -1) {
                        basePrice = Meteor.call('calculateBasePrice', variant, discount, 'USD');
                    } else {
                        basePrice = Meteor.call('calculateBasePrice', variant, discount, 'EUR');
                    }

                    $(elem).text(basePrice);

                    if (!discount.useDiscount) {
                        $(elem).css("display", "none");
                    }

                });

                $('.variant-sales-price').each(function(i, elem) {

                    variant = variants[i];

                    // Sales price
                    if (usdLocations.indexOf(location) != -1) {
                        salesPrice = Meteor.call('calculateSalesPrice', variant, discount, 'USD');
                    } else {
                        salesPrice = Meteor.call('calculateSalesPrice', variant, discount, 'EUR');
                    }

                    $(elem).text(salesPrice);

                    if (discount.useDiscount || variant.basePrice) {
                        $(elem).addClass('reduced-price');
                    }

                });

            }

        }

        output = $.html();

        var endProcess = new Date();

        console.log('Time to process rendered HTML: ' + (endProcess.getTime() - startProcess.getTime()) + ' ms');

        return output;

    }

});
