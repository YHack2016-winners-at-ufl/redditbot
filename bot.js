var Bot = require('slackbots');

var settings = {
	token: 'xoxb-103811241106-YeoRfDlq3HZO9HusMEC56ATO',
	name: 'redditbot'
};

var bot = new Bot(settings);

bot.on('start', function() {
	bot.postMessageToChannel('random', 'Get ready to hear some bullshit');
});