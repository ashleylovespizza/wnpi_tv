"use strict";
var gsjson = require('google-spreadsheet-to-json');
var Channel = require('./channel.js');

var SPREADSHEET_ID = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var IMPORT_CHANNELS = ['0', '1', '2'];

var channels = new Array();

module.exports = gsjson({
    spreadsheetId: SPREADSHEET_ID,
    worksheet: IMPORT_CHANNELS
})
.then(function(results) {
   
    console.log(results);
    for ( var i=0; i<results.length; i++) {
        var newChannel = new Channel(i, 'Channel '+ (i+1), results[i])
        console.log("whatup", results[i]);
        channels.push( newChannel );
    }
    console.log('spreadhset reader here ', channels.length);
    return channels;

    //console.log(channelData);

    // // assume all folders rn
    // for(i in channelData) {
    // 	for (j in channelData[i]) {
    // 		if ('content' in channelData[i][j]) {

    // 			console.log(channelData[i][j]['content']);
    // 			var folderName = channelData[i][j]['content'];
    // 			FOLDERS[folderName] = [];

    // 			if (FOLDERS[folderName].length == 0) {
    // 				var files = fs.readdirSync(folderName);
    // 				for (f in files) {
    // 					if ( (/\.(avi|mov|mkv|mp4)$/i).test(files[f])) {
    // 						FOLDERS[folderName].push(files[f])
    // 					}

    // 				}

    // 			}
    			
    // 		}
    // 	}
    // }

})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});



