/**
 * Created by joshbenner on 11/12/16.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var scrapeReddit = function(){

    //All the web scraping magic will happen here

    url = 'https://www.reddit.com/r/RoastMe/';
    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            $('.comments').filter(function(){

                // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

                // In examining the DOM we notice that the title rests within the first child element of the header tag.
                // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                //roast = data.text();
                urls = data[0].attribs.href;
                console.log(urls);


                request(urls, function(error, response, html){

                    // First we'll check to make sure no errors occurred when making the request

                    if(!error) {
                        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                        $ = cheerio.load( html );

                        $('.md').filter(function() {
                            data = $(this);
                            stuff = data.children();

                            if(data.children()[0].name == "p"){
                                var roast = stuff[0].children[0].data;
                                console.log(roast);
                                fs.writeFile('data.txt', roast + "\n", function(err) {
                                    if(err) throw err;
                                });
                            }


                            return "Wrote data to file";

                            //comment = data[0].children().first().text();
                            //console.log(comment);
                        });



                    }
                });

                // Once we have our title, we'll store it to the our json object.

            });
            // Finally, we'll define the variables we're going to capture

            var roast;
            var json = { roast : ""};
        }
    });
}

app.listen('8081');

console.log('Magic happens on port 8081');

module.exports = scrapeReddit();