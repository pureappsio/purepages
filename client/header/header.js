Template.header.helpers({

  title: function() {
    return Session.get('title');
  }

});

Template.header.rendered = function() {

  Meteor.call('getTitle', function(err, data) {
    Session.set('title', data);
  });
  
}