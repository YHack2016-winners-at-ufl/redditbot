/**
 * Created by joshbenner on 11/13/16.
 */
var Chart = require('chart');
var bot = require('./redditbot');
var scraper = require('./server.js');

$(document ).ready(function(){
    // Any of the following formats may be used
var ctx = document.getElementById('canvas').getContext('2d');
scraper.scrapeReddit(function(resp){
    console.log("resp: " , resp);
    var data = this.roasts;
    console.log("data: ", data);
    var lineChart = new Chart(ctx).Line(data);

});
});

