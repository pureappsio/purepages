Template.moduleElement.helpers({

	moduleImage: function() {
		var page = Pages.findOne(this.pageId);
		return Images.findOne(page.modules.image).link();
	}

});