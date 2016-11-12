
'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
//var scraper = require('our code to scrape it yo');
var Bot = require('slackbots');

var RedditBot = function Constructor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'redditbot';
	this.user = null;
};

//inherits from Constructor
util.inherits(RedditBot, Bot);

//runs the bot
RedditBot.prototype.run = function() {
	RedditBot.super_.call(this, this.settings);
	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

RedditBot.prototype._onStart = function() {
	this._loadBotUser();
	//set up scraper here
};

RedditBot.prototype._loadBotUser = function() {

	var self = this;
	//users returned as array, filter to find the bot in that array
	this.user = this.users.filter(function(user) {
		return user.name === self.name;
	})[0];
};

RedditBot.prototype._getInsultOrCompliment = function() {
	// 0 is insult, 1 is compliment
	return Math.floor(Math.random() * 2); //1 or 0;
};

RedditBot.prototype._giveGreeting = function() {

	var randomNumber = this._getInsultOrCompliment();
	var opening = ((randomNumber === 0) ? "Hello shitstains" : "Hello beautiful people");
	this.postMessageToChannel(this.channels[0].name, opening +
		"\n I'm a bot that will compliment you or roast you. Just say `roast me` or " +
		"`compliment me` or " + this.name + " and I'll hit you with reddit's best");
};

RedditBot.prototype._onMessage = function(message) {
	if (this._isChatMessage(message) &&
		this._isChannelConversation(message) &&
		!this._isFromRedditbot(message) &&
		this._isMentioningRedditbot(message)) {

		this._replyWithRandomRemark(message);
	}
}

RedditBot.prototype._isChatMessage = function(message) {

	return message.type === 'message' && Boolean(message.text);
}


module.exports = RedditBot;
