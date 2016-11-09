Template.pageListing.events({

	'click .delete': function() {

		Meteor.call('removePage', this._id);

	}

});

Template.pageListing.helpers({

	brand: function() {
		return Brands.findOne(this.brandId).name;
	}

});