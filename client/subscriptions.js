// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userBrands');
    Meteor.subscribe('userFunnels');
    Meteor.subscribe('userPages');
    Meteor.subscribe('userElements');
    Meteor.subscribe('userIntegrations');
    Meteor.subscribe('userCaches');
    Meteor.subscribe('userSessions');
    Meteor.subscribe('allUsers');
    Meteor.subscribe('files.images.all');
});

AutoForm.hooks({
    updatePageForm: {
        onSuccess: function() {

            Meteor.call('flushCache');
        }
    }
})
