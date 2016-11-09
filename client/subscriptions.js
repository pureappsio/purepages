// Tracker
Tracker.autorun(function() {
	Meteor.subscribe('userBrands');
    Meteor.subscribe('userPages');
    Meteor.subscribe('userElements');
    Meteor.subscribe('userIntegrations');
    Meteor.subscribe('files.images.all');
});