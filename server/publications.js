Meteor.publish("userPages", function() {
    return Pages.find({});
});

Meteor.publish("userElements", function() {
    return Elements.find({});
});


Meteor.publish("userBrands", function() {
    return Brands.find({});
});

Meteor.publish("userIntegrations", function() {
    return Integrations.find({});
});

Meteor.publish('files.images.all', function() {
    return Images.find().cursor;
});
