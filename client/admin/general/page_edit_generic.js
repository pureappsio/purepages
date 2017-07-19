Template.pageEditGeneric.helpers({

    brandOptions: function() {

        var brands = Brands.find({}).fetch();

        var brandOptions = [];

        for (i in brands) {
            brandOptions.push({
                value: brands[i]._id,
                label: brands[i].name
            });
        }

        return brandOptions;

    },
    webinarOptions: function() {

        return Session.get('webinarOptions');

    }
});

Template.pageEditGeneric.onRendered(function() {

    Meteor.call('getWebinars', function(err, data) {

        var webinarOptions = [];

        for (i in data) {
            webinarOptions.push({
                value: data[i]._id,
                label: data[i].name
            });
        }

        Session.set('webinarOptions', webinarOptions);

    });

});
