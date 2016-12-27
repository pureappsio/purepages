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

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditThankYou.onRendered(function() {

    if (this.data.brandId) {
        $('#brand-id :selected').val(this.data.brandId);
    }

});
