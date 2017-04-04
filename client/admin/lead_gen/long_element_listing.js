Template.longElementListing.events({

    'click .delete': function() {
        Meteor.call('removeElement', this._id);
    },
    'change .element-number': function(event, template) {
        var number = $('#number-' + this._id).val();
        Meteor.call('setElementNumber', number, this._id);
    },
    'change .element-title': function(event, template) {
        var title = $('#element-title-' + this._id).val();
        Meteor.call('setElementTitle', title, this._id);
    },
    'change .element-icon': function(event, template) {
        var icon = $('#element-icon-' + this._id).val();
        Meteor.call('setElementIcon', icon, this._id);
    }

});

Template.longElementListing.helpers({

    isTitle: function() {
        if (this.title) {
            return true;
        } else {
            return false;
        }
    },
    hasIcon: function() {
        if (this.icon || this.type == 'feature') {
            return true;
        } else {
            return false;
        }
    }

});

Template.longElementListing.onRendered( function() {

    if (this.data._id) {

        var elementId = this.data._id;

        // Init editor
        $('#element-content-' + elementId).summernote({
            callbacks: {
                onChange: function() {
                    Meteor.call('setElementContent', $('#element-content-' + elementId).summernote('code'), elementId);
                }
            }
        });

    }

    // Init data
    if (this.data.content) {
        $('#element-content-' + this.data._id).summernote('code', this.data.content);
    }

    // Init icon
    if (this.data.icon) {
        $('#element-icon-' + this.data._id).val(this.data.icon);
    }

});
