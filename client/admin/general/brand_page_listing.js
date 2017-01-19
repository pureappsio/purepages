Template.brandPageListing.helpers({

	pages: function() {
		return Pages.find({brandId : this._id}, {sort: {model: 1}});
	}

});