Template.pageListing.events({

    'click .delete': function() {

        Meteor.call('removePage', this._id);

    }

});

Template.pageListing.helpers({

    conversions: function() {

        if (this.model == 'salespage' || this.model == 'leadgen' || this.model == 'tripwire') {

            var visits = Sessions.find({ pageId: this._id, type: 'visit' }).fetch().length;
            var clicks = Sessions.find({ pageId: this._id, type: 'click' }).fetch().length;

            if (visits != 0) {
                return clicks / visits * 100 + '%';
            } else {
                return '0%';
            }
        }

    },
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
