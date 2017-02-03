Meteor.methods({

    flushCache: function() {

        // Flush
        console.log('Flushing cache');
        Caches.update({}, { $set: { cached: false } }, { multi: true });
        Pages.update({}, { $set: { cached: false } }, { multi: true });


    },
    renderHeader: function(options) {

        // Compile header
        SSR.compileTemplate('header', Assets.getText('header_template.html'));

        // Helpers
        Template.header.helpers({

            favicon: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.logo) {
                    return Images.findOne(brand.logo).link();
                }
            },
            pageName: function() {
                var brand = Brands.findOne(options.brandId);

                if (options.pageTitle) {
                    return options.pageTitle + ' - ' + brand.name;
                } else {
                    return brand.name;
                }


            },
            useTracking: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.trackingId) {
                    if (brand.trackingId != "") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            trackingId: function() {
                var brand = Brands.findOne(options.brandId);
                if (brand.trackingId) {
                    return brand.trackingId;
                }
            }

        });

        // Load css
        var css = Assets.getText('style.css');
        css += Assets.getText('sales_page.css');
        css += Assets.getText('tripwire_page.css');

        console.log('Rendering header');

        if (options.lead) {
            var trackLead = options.lead;
        } else {
            var trackLead = false;
        }

        // Get Facebook pixel
        var pixel = Meteor.call('getFacebookPixel');

        var headerHtml = SSR.render('header', { pixelId: pixel, css: css, trackLead: trackLead });
        // console.log(headerHtml);

        return headerHtml;

    },

    returnCachedPage: function(page) {

        // Get render
        console.log('Page cached, returning cached version');

        if (page.model == 'thankyou' || page.model == 'tripwire') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, lead: true, pageTitle: page.name });
        }
        if (page.model == 'salespage' || page.model == 'leadgen' || page.model == 'closed') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name });
        }

        return headerHtml + "<body>" + "<div class='container-fluid main-container'>" + page.html + "</div>" + "</body>";

    },

    processPage: function(page, query) {

        // Get URL
        var absoluteURL = Meteor.absoluteUrl();

        console.log('Page not cached, rendering');

        if (page.model == 'leadgen') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('lead_page_template.html'));

            // Get helpers
            helpers = Meteor.call('getLeadPageData', page, query);

        }

        if (page.model == 'tripwire') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, lead: true, pageTitle: page.name });

            // Get product data
            var productData = Meteor.call('getProductData', page._id);

            // Get brand data
            var brand = Brands.findOne(page.brandId);
            var brandLanguage = Meteor.call('getBrandLanguage', page.brandId);

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('tripwire_template.html'));

            // Helpers
            helpers = {
                mainImageLink: function() {
                    if (page.main.image) {
                        return Images.findOne(page.main.image).link();
                    }
                },
                messageImageLink: function() {
                    if (page.message.image) {
                        return Images.findOne(page.message.image).link();
                    }
                },
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                },
                elements: function(type) {
                    return Elements.find({ pageId: page._id, type: type });
                },
                checkoutLink: function() {

                    return 'https://' + Integrations.findOne(brand.cartId).url + '?product_id=' + productData._id;

                },
                salesPrice: function() {
                    if (brandLanguage == 'en') {
                        return '$' + (productData.price.USD).toFixed(2);
                    } else {
                        return (productData.price.EUR).toFixed(2) + ' €';
                    }
                },
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
                }

            }

        }

        if (page.model == 'thankyou') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, lead: true, pageTitle: page.name });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('thanks_page_template.html'));

            // Helpers
            helpers = {
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                }
            }

        }

        if (page.model == 'closed') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name });

            // Compile
            SSR.compileTemplate('pageTemplate',
                Assets.getText('course_closed_template.html'));

            // Helpers
            helpers = {
                brandPicture: function() {

                    var brand = Brands.findOne(page.brandId);
                    return Images.findOne(brand.image).link();
                }
            }

        }

        if (page.model == 'salespage') {

            // Render header
            headerHtml = Meteor.call('renderHeader', { brandId: page.brandId, pageTitle: page.name });

            // Set timer & discount
            var timer = Meteor.call('getTimerData', page, query);
            var discount = Meteor.call('getDiscountData', page, query);

            // Act according to timer
            if (timer.timerExpired == true) {

                console.log('Timer expired');

                // Reload page
                var page = Pages.findOne(page.timer.page);

                // Compile
                SSR.compileTemplate('pageTemplate',
                    Assets.getText('course_closed_template.html'));

            } else {

                // Compile
                SSR.compileTemplate('pageTemplate',
                    Assets.getText('sales_page_template.html'));

                // Get product data
                var productData = Meteor.call('getProductData', page._id);

            }

            // Get brand data
            var brand = Brands.findOne(page.brandId);
            var brandLanguage = Meteor.call('getBrandLanguage', page.brandId);

            // Helpers
            helpers = {

                useVideo: function() {

                    if (page.header) {
                        if (page.header.video) {
                            return true;
                        }
                    }

                },
                videoLink: function() {

                    if (page.header) {
                        if (page.header.video) {
                            return Images.findOne(page.header.video).link()
                        }
                    }

                },
                paymentButtonText: function() {

                    var buttonText = "";

                    // Brand
                    var brand = Brands.findOne(this.brandId);

                    // Language
                    if (brand.language) {
                        if (brand.language == 'fr') {
                            buttonText = "S'inscrire maintenant!";
                        } else {
                            buttonText = "Enroll Now!";
                        }
                    } else {
                        buttonText = "Enroll Now!";
                    }

                    if (page.payment) {

                        if (page.payment.button) {

                            if (page.payment.button != "") {
                                buttonText = page.payment.button;
                            }

                        }

                    }

                    return buttonText;

                },
                checkoutLink: function() {

                    var link = 'https://' + Integrations.findOne(brand.cartId).url + '?product_id=' + productData._id;

                    if (discount.useDiscount == true) {
                        link += '&discount=' + discount.code;
                    }

                    if (query.origin) {
                        link += '&origin=' + query.origin;
                    }

                    return link;

                },
                isDiscounted: function() {
                    return discount.useDiscount;
                },
                meteorURL: function() {
                    return absoluteURL;
                },
                timerActive: function() {
                    if (timer.useTimer) {
                        return true;
                    } else {
                        return false;
                    }
                },
                timerEnd: function() {
                    return timer.expiryDate;
                },
                isAffiliateLink: function() {
                    if (query.ref) {
                        return true;
                    } else {
                        return false;
                    }
                },
                affiliateLink: function() {
                    if (query.ref) {
                        return '&ref=' + query.ref;
                    } else {
                        return '';
                    }
                },
                salesPrice: function() {
                    if (brandLanguage == 'en') {
                        var price = parseFloat(productData.price.USD);
                        price = price * (1 - parseInt(discount.amount) / 100);

                        return '$' + price.toFixed(2);
                    } else {
                        var price = parseFloat(productData.price.EUR);
                        price = price * (1 - parseInt(discount.amount) / 100);

                        return price.toFixed(2) + ' €';
                    }
                },
                baseSalesPrice: function() {
                    if (brandLanguage == 'en') {
                        var price = parseFloat(productData.price.USD);
                        return '$' + price.toFixed(2);
                    } else {
                        var price = parseFloat(productData.price.EUR);
                        return price.toFixed(2) + ' €';
                    }
                },
                productName: function() {
                    return productData.name;
                },
                salesImage: function() {

                    if (page.payment) {
                        if (page.payment.image) {
                            return 'background-image: url(' + Images.findOne(page.payment.image).link() + ')';

                        }
                    }

                },
                headerImage: function() {

                    if (page.header) {
                        if (page.header.image) {
                            return 'background-image: url(' + Images.findOne(page.header.image).link() + ')';
                        }
                    }

                },
                greenTheme: function() {

                    if (page.theme) {
                        if (page.theme == 'green') {
                            return 'background-color: #389839;';
                        }
                    }

                },
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
                areBonuses: function() {

                    if (this.bonuses) {
                        if (this.bonuses.title == '') {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }

                },
                faqElements: function() {
                    return Elements.find({ type: 'faq', pageId: this._id }, { sort: { number: 1 } });
                },
                whoElements: function() {
                    return Elements.find({ type: 'who', pageId: this._id }, { sort: { number: 1 } });
                },
                paymentElements: function() {
                    return Elements.find({ type: 'payment', pageId: this._id }, { sort: { number: 1 } });
                },
                moduleImage: function(module) {
                    var page = Pages.findOne(module.pageId);
                    return Images.findOne(page.modules.image).link();
                }

            }

        }

        // Helpers
        Template.pageTemplate.helpers(helpers);

        // Render
        var html = SSR.render('pageTemplate', page);

        // Save if no affiliate code
        if (!(query.ref) && !(query.origin) && !(query.subscriber) && !(query.discount)) {
            console.log('Caching page');
            Pages.update(page._id, { $set: { cached: true, html: html } })
        } else {
            console.log('Saving html');
            Pages.update(page._id, { $set: { cached: false, html: html } })
        }

        return headerHtml + "<body>" + "<div class='container-fluid main-container'>" + html + "</div>" + "</body>";


    },
    renderPage: function(postUrl, query) {

        // Find post or page
        if (Pages.findOne({ url: postUrl })) {

            // Query
            var page = Pages.findOne({ url: postUrl });

            // Check if cached
            if (page.cached == true && !(query.ref) && !(query.origin) && !(query.subscriber) && !(query.discount)) {

                return Meteor.call('returnCachedPage', page);

            } else {
                return Meteor.call('processPage', page, query);
            }

        } else {

            // Render header
            headerHtml = Meteor.call('renderHeader', {});

            return headerHtml + "<body>" + "</body>";
        }

    }

});
