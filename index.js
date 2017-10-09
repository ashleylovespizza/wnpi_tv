"use strict";
/*
*   WNPI TV looper
*   Scheduling will eventually be done via a google doc that gets pulled
*    down every 24 hours into - 
*		https://docs.google.com/spreadsheets/d/1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0/edit#gid=0
*
*
*/
var moment = require('moment');

var gsjson = require('google-spreadsheet-to-json');
var spreadsheetId = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';

var Channel = require('./channel.js');

var channels = [];



function init() {

	channels[1].print();
}

var channels_to_import = ['0', '1', '2'];
gsjson({
    spreadsheetId: spreadsheetId,
    worksheet: channels_to_import
})
.then(function(results) {

    console.log(results.length);
    //channelData = result;
   // console.log(result);
    for ( var i=0; i<results.length; i++) {
    	var newChannel = new Channel(i, 'Channel '+ (i+1), results[i])
    	channels.push( newChannel );
    }
    init();

})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});

