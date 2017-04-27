Template.pictureListing.helpers({

    imageLink: function() {
        return Images.findOne(this.pictureId).link();
    }

});


Template.pictureListing.events({

    'click .delete': function() {
        Meteor.call('removeElement', this._id);
    }

});