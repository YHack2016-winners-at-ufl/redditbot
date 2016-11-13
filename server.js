/**
 * Created by joshbenner on 11/12/16.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bot = require('./redditbot');
var _ = require('underscore');
var sentiment = require('sentiment');
var Chain = require('markov-chains').default;
var app     = express();


function Roast(message,votes, score){
    this.msg = message || "";
    this.upvotes = votes || 0;
    this.score = score || 0;
}

var callback = function(roast){
    //do something with roast
    bot._onMessage(roast);
};

var scraper = {
    counter: 0,
    //Top 2 pages of Top RoastMe for this week
    url: ['https://www.reddit.com/r/RoastMe/top/?sort=top&t=week',
        "https://www.reddit.com/r/RoastMe/top/?sort=top&t=week&count=25&after=t3_5c0wn5"],
    roasts: [],
    states: [],
    scrapeReddit: function(callback) {
        var that = this;
        //All the web scraping magic will happen here

        // The structure of our request call
        // The first parameter is our URL
        // The callback function takes 3 parameters, an error, response status code and the html
        this.url.forEach(function(url){
            request( url, function (error, response, html) {

            // First we'll check to make sure no errors occurred when making the request

            if ( !error ) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $ = cheerio.load( html );
                var roastPages = [];
                //Grab the roastMe pages and push them in an array
                $( '.comments' ).filter( function () {

                    // Let's store the data we filter into a variable so we can easily see what's going on.
                    var data = $( this );

                    // In examining the DOM we notice that the title rests within the first child element of the header tag.
                    // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                    //roast = data.text();
                    roastPages.push( data[0].attribs.href );

                } );
                //roastPages.shift();
                //console.log(roastPages);
                roastPages.forEach(function(thread)
                {
                    request( thread, function (error, response, html) {
                    // First we'll check to make sure no errors occurred when making the request

                    if ( !error ) {
                        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                        $ = cheerio.load( html );

                        $( '.md' ).filter( function () {
                            var data = $( this );
                            var votes = data.parent().parent().parent().children().first().children()[5];
                            if(typeof votes !== 'undefined'){
                                if(votes.attribs.class == "score likes"){
                                    votes = votes.children[0].data;
                                    stuff = data.children();
                                    var roast = "";
                                    if ( data.children()[0].name == "p" ) {
                                        roast = stuff[0].children[0].data;
                                        score = sentiment(roast);
                                        //roasts.push( roast );
                                        that.roasts.push(new Roast(roast,parseInt(votes.split(" ")[0]),score));
                                    }
                                    //console.log("roast: " , roast, " votes: ", votes);
                                }
                            }
                        } );
                        that.roasts = _.sortBy(that.roasts, 'upvotes' ).reverse();
                        that.roasts = _.filter(that.roasts, function(num){ return num.upvotes >= 4; });
                        //console.log(that.roasts);
                        callback(new Roast("bot started",0 , {score: { score: 0}}));
                    }
                } );
                });

                that.roasts = _.sortBy(that.roasts, 'upvotes' ).reverse();
                that.roasts = _.filter(that.roasts, function(num){ return num.upvotes >= 4; });
                //Write to data.txt
                fs.writeFile(
                     "data.txt",
                     JSON.stringify(that.roasts),

                    function (err) {
                        if (err) {
                            console.error('Crap happens');
                        }
                });
            }
        } );
        });

    },
    getRoast: function(callback){
        var msg = this.roasts[this.counter];
        this.counter++;

        console.log(msg.msg);
        callback(msg);
    },
    fillStates: function() {
        console.log("inside fillStates");
        console.log("this.roasts.length: " + this.roasts.length);
        //console.log("this.roasts[0].msg: " + this.roasts[0].msg);
        for (var i = 0; i < this.roasts.length; i++) {
            this.states[i] = (new Array(this.roasts[i].msg));
            //console.log("this.states[i]: " + this.states[i]);
        }
        //console.log("this.states: " + this.states);
    },
    generateRoast: function(callback) {
        console.log("inside generateRoast");
        this.fillStates();
        var chain = new Chain(this.states);
        // generate a forecast
        const markovRoastArr = chain.walk();
        console.log("markov roast: " + markovRoastArr);


        var roast = markovRoastArr[0];
        markovRoast = new Roast(roast, 0, sentiment(roast));
        
        callback(markovRoast);
    }
}

app.use('/', express.static('public'));

app.listen(5000, function (){
    console.log("Savagery happens on port 5000");
});


module.exports = scraper;
