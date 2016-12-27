Template.pageEdit.helpers({

    isPage: function(pageType) {
        if (this.model == pageType) {
            return true;
        }
        else {
            return false;
        }
    }

});