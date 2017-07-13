Template.brandPageListing.helpers({

    pages: function() {
        return Pages.find({ brandId: this._id }, { sort: { model: 1 } });
    },
    brandSelected: function() {

        if (Session.get('brandSelected')) {

            if (Session.get('brandSelected') == 'all') {
                return true;
            } else if (Session.get('brandSelected') == this._id) {
                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }

    }

});
