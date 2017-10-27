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
var getDuration = require('get-video-duration');

var SPREADSHEET_ID = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var SRC_LOCATION = "/Volumes/WNPI_SRC/wnpi/";



let instance = null;

module.exports = class TvGuide {
    constructor () {
        if (!instance) {
            instance = this;
        }

        this.channels = [];
        this.folders = [];
        this.curr_channel = 0;
        this.initialized = false;

        return instance;
    }
    

    createTvGuide() {
        console.log('create tv guide');
        // assume all folders rn
        var prevFolder = null;
        var currFolder = null;
        var mostRecentStart = null;
        var mostRecentLength = null;

        // first, get all folders used
        for (let i=0; i<instance.channels.length; i++) {

            for (let j=0; j<instance.channels[i]['content'].length; j++) {
                  
                var line = instance.channels[i]['content'][j];
                if (line['content'] != null) {
                    console.log(line['content'])
                    var folder = SRC_LOCATION + line['content'];
                    instance.folders.push(folder);
                    // and get its legth
                    getDuration(folder).then((duration) => {
                      console.log(duration);
                    });


                }
            }
           
        }

        for (let i=0; i<instance.folders.length; i++) {
          //  console.log(instance.folders[i])
        }


        for (let i=0; i<instance.channels.length; i++) {
            if (instance.channels[i]['content'] != null) {

             // console.log('look into ', instance.channels[i]['content']);
              currFolder = SRC_LOCATION + instance.channels[i]['content'];

              // start at first 'content' listing, go until next (wrapping around if necessary)


              // FOLDERS[folderName] = [];

              // if (FOLDERS[folderName].length == 0) {
              //   var files = fs.readdirSync(folderName);
              //   for (f in files) {
              //     if ( (/\.(avi|mov|mkv|mp4)$/i).test(files[f])) {
              //       FOLDERS[folderName].push(files[f])
              //     }

              //   }

              // }
            }
            if (currFolder != null) {
                // if (prevFolder == null) {
                //     // happening for the FIRST TIME
                //     prevFolder  = currFolder;
                // }

                // if (mostRecentStart == null) {
                //     // let's start something
                // }
                // // if (current time - most recent start time) - the lenght of whatever it thinks it's playing rn is less than 30 min)
                // if ( ((instance.channels[i]['time'] - mostRecentStart) - mostRecentLength) < 30) {

                // }

            }
        }


        instance.initialized = true;
        return instance.channels;
        
    }

    init() {

        require('./spreadsheetReader.js')
        .then(function(results){
            //console.log("THEN!!!")
            instance.channels = results;
            //console.log('channels:', channels);
            instance.createTvGuide();
        })
        .catch(function(err){ 
            //console.log("ERRAR", err); 
        });

    }

}
