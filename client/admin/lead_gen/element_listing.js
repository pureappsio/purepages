Template.elementListing.events({

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
	'change .element-content': function(event, template) {
		var content = $('#element-content-' + this._id).val();
		Meteor.call('setElementContent', content, this._id);
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