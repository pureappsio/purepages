Template.pageEditSaas.helpers({

    brands: function() {
        return Brands.find({});
    },
    elements: function() {
        return Elements.find({ pageId: this._id, type: 'element' }, { sort: { number: 1 } });
    },
    features: function() {
        return Elements.find({ pageId: this._id, type: 'feature' }, { sort: { number: 1 } });
    },
    integrations: function() {
        return Elements.find({ pageId: this._id, type: 'integration' }, { sort: { number: 1 } });
    },
    testimonials: function() {
        return Elements.find({ pageId: this._id, type: 'testimonial' }, { sort: { number: 1 } });
    }

});

Template.pageEditSaas.events({

    'click #add-element': function() {

        var element = {
            type: 'element',
            title: $('#element-title').val(),
            content: $('#element-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        if (Session.get('elementPicture')) {
            element.pictureId = Session.get('elementPicture');
        }

        Meteor.call('createElement', element);

    },
    'click #add-testimonial': function() {

        var element = {
            type: 'testimonial',
            name: $('#testimonial-name').val(),
            company: $('#testimonial-company').val(),
            content: $('#testimonial-content').summernote('code'),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        if (Session.get('testimonialPicture')) {
            element.pictureId = Session.get('testimonialPicture');
        }

        Meteor.call('createElement', element);

    },
    'click #add-integration': function() {

        var element = {
            type: 'integration',
            pageId: this._id,
            userId: Meteor.user()._id
        }

        if (Session.get('integrationPicture')) {
            element.pictureId = Session.get('integrationPicture');
        }

        Meteor.call('createElement', element);

    },
    'click #add-feature': function() {

        var element = {
            type: 'feature',
            title: $('#feature-title').val(),
            content: $('#feature-content').summernote('code'),
            icon: $('#feature-icon').val(),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #save-page': function() {

        // Base parameters
        var page = this;
        console.log(this);

        // Brand
        page.brandId = $('#brand-id :selected').val();

        // Header
        page.header = {};
        page.header.title = $('#header-title').val();
        page.header.button = $('#header-button').val();
        page.header.link = $('#header-link').val();
        page.header.text = $('#header-text').summernote('code');

        // Secondary button
        if ($('#header-secondary-button').val() != "") {
            page.header.secondaryButton = $('#header-secondary-button').val();
            page.header.secondaryLink = $('#header-secondary-link').val();
        }

        // if (this.header) {

        //     if (this.header.image) {
        //         page.header.image = this.header.image;
        //     }

        //     if (this.header.secondaryVideo) {
        //         page.header.secondaryVideo = this.header.secondaryVideo;
        //     }

        // }

        if (Session.get('headerImage')) {
            page.header.image = Session.get('headerImage');
        }

        if (Session.get('secondaryVideo')) {
            page.header.secondaryVideo = Session.get('secondaryVideo');
        }

        // Integrations
        page.integrations = {};
        page.integrations.title = $('#integrations-row-title').val();

        // Message
        page.message = {};
        page.message.text = $('#message-text').val();
        page.message.button = $('#message-button').val();
        page.message.link = $('#message-link').val();

        // Features
        page.features = {};
        page.features.title = $('#feature-row-title').val();

        // Testimonials
        page.testimonials = {};
        page.testimonials.title = $('#testimonials-row-title').val();

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditSaas.onRendered(function() {

    if (this.data.brandId) {

        // Set brand
        $("#brand-id").val(this.data.brandId);

    }

    $('#header-text').summernote({
        minHeight: 150 // set editor height
    });

    if (this.data.header) {
        if (this.data.header.text) {
            $('#header-text').summernote('code', this.data.header.text);
        }
    }

    $('#element-content').summernote({
        minHeight: 150 // set editor height
    });

    $('#testimonial-content').summernote({
        minHeight: 150 // set editor height
    });

    $('#feature-content').summernote({
        minHeight: 150 // set editor height
    });

});
