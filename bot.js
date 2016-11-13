var RedditBot = require('./redditbot');
var fs = require('fs');
var token = require('./config').bot;
var settings = {
    token: token,
    name: 'redditbot'
};
var bot = new RedditBot(settings);
bot.run();
bot.on('start', function() {

	bot.postMessageToChannel('general', 'Get ready to hear some bullshit');
});

