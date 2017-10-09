/*
*   WNPI TV looper
*   Scheduling will eventually be done via a google doc that gets pulled
*    down every 24 hours into - 
*		https://docs.google.com/spreadsheets/d/1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0/edit#gid=0
*
*
*/



var gsjson = require('google-spreadsheet-to-json');
var moment = require('moment');
var spreadsheetId = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var channels = ['0', '1', '2']

var mainLoop = null;
var channelData = null;

// eventually track channel in file so you can keep it persistent overnight
var currentChannel = 0;
var currentlyPlaying = null;
// TODO - currently playing should be like this:
/*
var currentlyPlaying = Array of length channels.length
each index (channel) tracks an object - {'currentplayingFile': '', 'starttime': moment.js thing}
*/


function main() {
	console.log("the time is now " + moment().format());

	if (channelData) {
		// check if currently playing is the thing that should be currently playing

		var currentRow = (Math.floor(( Number(moment().format('mm')) /60)*2)/2 + Number(moment().format('HH')) * 2) + 2	
		var shouldBePlaying = null;
		while(shouldBePlaying == null) {

			if ('file' in channelData[currentChannel][currentRow]) {
				//console.log('THIS IS IT!');
				//console.log(channelData[currentChannel][currentRow]);
				shouldBePlaying = channelData[currentChannel][currentRow]['file']
			} else {
				//console.log("not yet...")
				currentRow--;
				if (currentRow < 2) { currentRow = 49 }
			}
		}

		if (currentlyPlaying != shouldBePlaying) {
			// here's where we actually send out the file in the real thing...
			currentlyPlaying = shouldBePlaying

			// TODO
			// channel switching - start files correct # of minutes in...
			// need to update way currentlyPlaying is being read/written
			console.log("start playing "+currentlyPlaying);
		}

	}

}

mainLoop = setInterval(main, 2000);


gsjson({
    spreadsheetId: spreadsheetId,
    worksheet: channels
})
.then(function(result) {
    console.log(result.length);
   // console.log(result);
    channelData = result;

})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});

