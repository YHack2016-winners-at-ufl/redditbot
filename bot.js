
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

module.exports = RedditBot;