Template.registerHelper("truncate", function(number) {
    return number.toFixed(0);
});

Template.registerHelper("truncateTwo", function(number) {
    return number.toFixed(2);
});

// Template.registerHelper("langEN", function () {
//     if (Session.get('language')) {
//       if (Session.get('language') == 'en') {
//         return true;
//       }
//       else {
//         return false;
//       }
//     }
//     else {
//       return true;
//     }
// });

Template.registerHelper("isAdmin", function() {
    if (Meteor.user()) {
        if (Meteor.user().emails[0].address == 'marcolivier.schwartz@gmail.com') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

});
