var RedditBot = require('./redditbot');
var fs = require('fs');

var settings = {
    token: 'xoxb-103811241106-QIwFbuPamDbFbgiuBYQs9CJX',
    name: 'redditbot'
};

var bot = new RedditBot(settings);
bot.run();
bot.on('start', function() {
    bot.postMessageToChannel('mentions', 'Get ready to hear some bullshit');
});
