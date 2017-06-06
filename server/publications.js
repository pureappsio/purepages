import Images from '../imports/api/files';

Meteor.publish("userPages", function() {
    return Pages.find({});
});

Meteor.publish("userElements", function() {
    return Elements.find({});
});

Meteor.publish("userCaches", function() {
    return Caches.find({});
});

Meteor.publish("userBrands", function() {
    return Brands.find({});
});

Meteor.publish("userIntegrations", function() {
    return Integrations.find({});
});

Meteor.publish("userSessions", function() {
    return Sessions.find({});
});

Meteor.publish("allUsers", function() {
    return Meteor.users.find({});
});

Meteor.publish('files.images.all', function() {
    return Images.find().cursor;
});
