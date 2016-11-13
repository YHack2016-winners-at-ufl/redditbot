var request = require('request');
var token = require('./config').bot;
var tokenQuery = '?token=' + token;
var apiUrl = 'https://slack.com/api/';
var methods = {
    userInfo: 'users.info'
}


module.exports = {
    userInfo: function(userId, callback) {
        var base = apiUrl + methods.userInfo + tokenQuery;
        request(base + '&user=' + userId, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.ok === true) {
                    callback(body.user);
                }
            } else {
                console.log(error);
                callback(null);
            }
        })
    }
}
