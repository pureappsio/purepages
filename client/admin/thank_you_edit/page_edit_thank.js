Template.pageEditThankYou.helpers({

    brands: function() {
        return Brands.find({});
    },
    elements: function() {
        return Elements.find({ pageId: this._id });
    }

});

Template.pageEditThankYou.events({

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

        // Header
        page.header = {};
        page.header.title = $('#header-title').val();
        page.header.subtitle = $('#header-subtitle').val();

        // Video
        if (this.videoId) {
            page.videoId = this.videoId;
        }
        if (Session.get('video')) {
            page.videoId = Session.get('video');
        }

        // Button one
        if ($('#button-text').val() != "") {
            page.button = {};
            page.button.text = $('#button-text').val();
            page.button.link = $('#button-link').val();
            page.button.color = $('#button-color :selected').val();
        }

        if ($('#button-two-text').val() != "") {
            page.buttonTwo = {};
            page.buttonTwo.text = $('#button-two-text').val();
            page.buttonTwo.link = $('#button-two-link').val();
            page.buttonTwo.color = $('#button-two-color :selected').val();
        }

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditThankYou.onRendered(function() {

    if (this.data.brandId) {
        $('#brand-id :selected').val(this.data.brandId);
    }

});
