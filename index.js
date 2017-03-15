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
var fs = require('fs');
require("moment-duration-format");


var spreadsheetId = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var channels = ['0', '1', '2']

var mainLoop = null;
var channelData = null;

var FOLDERS = {};

// eventually track channel in file so you can keep it persistent overnight
var currentChannel = 0;
var currentlyPlaying = [];
for (var i=0; i<channels.length; i++) {
	currentlyPlaying.push({});
}
/*
var currentlyPlaying = Array of length channels.length
each index (channel) tracks an object - 
	{'currentplayingFolder': '', 
	 'currentplayingFile': '',
	 'starttime': moment() at time of start}
*/


function main() {
	console.log("the time is now " + moment().format());

	if (channelData) {
		// check if currently playing is the thing that should be currently playing
		var currentRow = ( ((Math.floor( ( Number(moment().format('mm')) /60)*2  ))) + Number(moment().format('HH')) * 2) + 2;
		var shouldBePlaying = null;
		while(shouldBePlaying == null) {
			// console.log("currentChannel: "+currentChannel);
			// console.log("currentRow: "+currentRow);
			// console.log("wtf: "+channelData[currentChannel][currentRow])
			if ('content' in channelData[currentChannel][currentRow]) {
				//console.log('THIS IS IT!');
				//console.log(channelData[currentChannel][currentRow]);
				shouldBePlayingFolder = channelData[currentChannel][currentRow]['content']
			} else {
				//console.log("not yet...")
				currentRow--;
				if (currentRow < 0) { currentRow = 48 }
			}
		}

		//console.log("currentlyPlaying: ")
		//console.log(currentlyPlaying)

		// FOR NOW assume everything is folders...
		// but in the future, here's a handy regex to test if something's a movie file:
		//   (/\.(avi|mov|mkv|mp4)$/i).test(stringInQuestion)


		if ( currentlyPlaying[currentChannel] == null ||
			!('currentplayingFolder' in currentlyPlaying[currentChannel]) ||
		     currentlyPlaying[currentChannel]['currentplayingFolder'] != shouldBePlayingFolder) {
			// here's where we actually send out the file in the real thing...
			currentlyPlaying[currentChannel]['currentplayingFile'] = shouldBePlayingFolder;
			currentlyPlaying[currentChannel]['starttime'] = moment();

			console.log("Start playing file ")
			// PLAY from beginning
			// play( currentlyPlaying[currentChannel]['currentplayingFile'], "00:00:00");

			console.log("start playing "+currentlyPlaying);
		} else {
			// you've flipped channels and the correct thing is playing...
			// update video playhead time
			var currentTime = moment();
			var duration = moment.duration(currentTime.diff(currentlyPlaying[currentChannel]['starttime']));
			
			
		}

	}

}



gsjson({
    spreadsheetId: spreadsheetId,
    worksheet: channels
})
.then(function(result) {
    console.log(result.length);
   // console.log(result);
    channelData = result;
    //console.log(channelData);


    for(i in channelData) {
    	for (j in channelData[i]) {
    		if ('content' in channelData[i][j]) {

    			console.log(channelData[i][j]['content']);
    			var folderName = channelData[i][j]['content'];
    			FOLDERS[folderName] = [];

    			if (FOLDERS[folderName].length == 0) {
    				var files = fs.readdirSync(folderName);
    				for (f in files) {
    					if ( (/\.(avi|mov|mkv|mp4)$/i).test(files[f])) {
    						FOLDERS[folderName].push(files[f])
    					}

    				}

    			}
    			
    		}
    	}
    }


    	console.log(FOLDERS)
mainLoop = setInterval(main, 2000);
})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});

