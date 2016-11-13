'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var sentiment = require('sentiment');
var webapi = require('./web-api');

var scraper = require('./server.js');
var Bot = require('slackbots');

var channelName = 'mentions';

var RedditBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'a';
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
    var that = this;

    scraper.scrapeReddit(function(msg) {
        //console.log("test: ", msg);
        //that._replyWithRandomRemark(msg);
    });

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
    this.postMessageToChannel(channelName, opening +
        "\n I'm a bot that will compliment you or roast you. Just say `roast me` or " +
        "`compliment me` or " + this.name + " and I'll hit you with reddit's best");
};

RedditBot.prototype._onMessage = function(message) {

    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromRedditbot(message) &&
        this._isMentioningRedditbot(message)) {

    	this._replyWithRandomRemark(message);
    	this._replyWithMarkovRemark(message);
    }
};

RedditBot.prototype._isChatMessage = function(message) {

    return message.type === 'message' && Boolean(message.text);
};

RedditBot.prototype._isChannelConversation = function(message) {

    return typeof message.channel === 'string' && message.channel[0] === 'C';
};

RedditBot.prototype._isFromRedditbot = function(message) {

    return message.user === this.user.id;
};

RedditBot.prototype._isMentioningRedditbot = function(message) {

    return message.text.toLowerCase().indexOf('roast me') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

RedditBot.prototype._replyWithRandomRemark = function(message) {

    var self = this;
    webapi.userInfo(message.user, function(user) {
        //console.log('user', user)
        if (!user) {
            console.log('error on userinfo');
            return;
        }

        var userName;
        var chIdx = _.findIndex(self.channels, function(_channel) {
            return _channel.name == channelName;
        });


        userName = user.name;
        scraper.getRoast(function(roast) {
            self.postMessageToChannel('random', '@' + userName + ' ' + "Reddit thought this about you: \n" + roast.msg + "\n Sentiment Score Analysis: " + roast.score.score);
        });
    });
};


RedditBot.prototype._replyWithMarkovRemark = function(message) {
    var that = this;
    scraper.generateRoast(function(roast){
        that.postMessageToChannel('random', "Here's something I came up with myself: \n" + roast.msg + "\n Sentiment Score Analysis: " + roast.score.score);
    });
}

// RedditBot.prototype._replyWithMarkovRemark = function(message) {
//   var self = this;
//   webapi.userInfo(message.user, function(user) {
//       //console.log('user', user)
//       if (!user) {
//           console.log('error on userinfo');
//           return;
//       }
//
//       var userName;
//       var chIdx = _.findIndex(self.channels, function(_channel) {
//           return _channel.name == channelName;
//       });
//
//
//       userName = user.name;
//       scraper.generateRoast(function(roast) {
//           self.postMessageToChannel('random', '@' + userName + ' ' + "Here's something I came up by myself: \n" + roast.msg + "Sentiment Score Analysis: " + roast.score.score);
//       });
//   });
// }
module.exports = RedditBot;
