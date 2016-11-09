Template.brandListing.events({

	'click .delete': function() {

		Meteor.call('removeBrand', this._id);

	}

});