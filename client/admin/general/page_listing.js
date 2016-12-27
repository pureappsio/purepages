Template.pageListing.events({

	'click .delete': function() {

		Meteor.call('removePage', this._id);

	}

});

Template.pageListing.helpers({

	brand: function() {
		return Brands.findOne(this.brandId).name;
	},
	printModel: function() {
		if (this.model == 'salespage') {
			return 'Sales Page';
		}
		if (this.model == 'closed') {
			return 'Course Closed Page';
		}
		if (this.model == 'leadgen') {
			return 'Lead Gen Page';
		}
		if (this.model == 'thankyou') {
			return 'Thank You Page';
		}
		if (this.model == 'tripwire') {
			return 'Tripwire Page';
		}
	}

});