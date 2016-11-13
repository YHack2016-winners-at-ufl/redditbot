var request = require('request');
var tokenQuery = '?token=xoxp-103741904115-103167763776-103954660932-9b931f00e33bc55789296c3ee99f2e16';
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
