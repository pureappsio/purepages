Template.elementListing.events({

	'click .delete': function() {
		Meteor.call('removeElement', this._id);
	}

});

Template.elementListing.helpers({

	isTitle: function() {
		if (this.title) {
			return true;
		}
		else {
			return false;
		}
	}

});