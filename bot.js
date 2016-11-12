var RedditBot = require('./redditbot');
var fs = require('fs');

var slackToken;

fs.readFile('keys.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  slackToken = data;
	var settings = {
	token: slackToken,
	name: 'redditbot'
};

var bot = new RedditBot(settings);
bot.run();
bot.on('start', function() {
	bot.postMessageToChannel('random', 'Get ready to hear some bullshit');
});
});


