Template.elementListing.events({

	'click .delete': function() {
		Meteor.call('removeElement', this._id);
	},
	'click .edit': function(event, template) {
		var number = $('#number_' + this._id).val();
		Meteor.call('setElementNumber', number, this._id);
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