var RedditBot = require('./redditbot');

var settings = {
	token: 'xoxb-103811241106-bz1DZQicazGf5FUIc4SCVOPS',
	name: 'redditbot'
};

var bot = new RedditBot(settings);
bot.run();
bot.on('start', function() {
	bot.postMessageToChannel('random', 'Get ready to hear some bullshit');
});
