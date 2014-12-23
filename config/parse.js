var Parse = require('parse').Parse;

// PARSE =========================================================
module.exports = function(parse) {

    var userQuery = new Parse.Query(Parse.User);
    userQuery.find({
        success: function(users) {
            console.log(users[0]);
            // for (var i = 0; i < users.length; i++) {
            //     console.log(users);
            // }
        }
    });

    var ConvoQuery = Parse.Object.extend('Conversation');
    var query = new Parse.Query(ConvoQuery);
    query.find({
        success: function(convo) {
            // console.log(convo[0]);
        },

        error: function(error) {
            console.log(error);
        }
    });    

}
