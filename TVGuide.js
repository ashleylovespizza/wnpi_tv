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
//  var getDuration = require('get-video-duration');


var fs = require('fs'),
    path = require('path');



//var SPREADSHEET_ID = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
//var SRC_LOCATION = "/Volumes/VIDEOS/wnpi/";
var SRC_LOCATION = "/Users/ashley/Projects/wnpi/wnpi_tv/app/videos/"


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


    dirTree(filename) {
        console.log("working: "+filename)
        var stats = fs.lstatSync(filename);
        var info = {};

        console.log(path.basename(filename));
      // console.log (  )
      // console.log( 'is it a directory?')
      // console.log(stats.isDirectory())
      // console.log("IS IT ???")
      // console.log( (path.basename(filename) == 'videos') && ( stats.isDirectory() ))


        if ( (path.basename(filename) == 'videos') && (stats.isDirectory())  ) {
            // filename is root directory, make guide root and don't worry about any other info
            info.guide = fs.readdirSync(filename).map(function(child) {

                  if (path.basename(filename) != '.DS_Store') {

                                      console.log("hey ")
                                        return instance.dirTree(filename + '/' + child);
                  }
            });

        } else if (!isNaN(parseInt(path.basename(filename))) && stats.isDirectory() ) {
            // foldername is an integer
            info.channel = parseInt(path.basename(filename));
            info.cardbg = 'channelcard_' + path.basename(filename) + '.jpg';

                console.log("ho ")
            info.shows = fs.readdirSync(filename).map(function(child) {
                return instance.dirTree(filename + '/' + child);
            });

        } else if ( (path.basename(filename) == 'LATER') && stats.isDirectory() ) {
              // foldername is 'LATER
              info.channel = 'LATER';
              info.cardbg = 'channelcard_' + path.basename(filename) + '.jpg';

                  console.log("later ")
              info.shows = fs.readdirSync(filename).map(function(child) {
                  return instance.dirTree(filename + '/' + child);
              });

          } else if ( !stats.isDirectory()
                    && (path.basename(filename)).substring(0,2) != '._'
                    && (/\.(mov|mp4)$/i).test(path.basename(filename))) {
            // mp4/mov file!

                console.log("blerg ")
            info.filename = path.basename(filename);
        }

        return info;
      }




    createTvGuide() {
       var currFolder = SRC_LOCATION;

       // start at first 'content' listing, go until next (wrapping around if necessary)
       if (fs.existsSync(SRC_LOCATION + ".DS_Store")) {
         fs.unlinkSync(SRC_LOCATION + ".DS_Store");
       }

        var tvguide = instance.dirTree(SRC_LOCATION);
        console.log("wtf");
        console.log(tvguide);

        for ( var i=0; i<tvguide.guide.length; i++) {
          console.log(tvguide.guide[i])
          if (tvguide.guide[i] != {}) {
            for( var j=tvguide.guide[i].shows.length-1; j>-1; j--) {

                var isEmptyObj = (Object.keys(tvguide.guide[i].shows[j]).length === 0 && tvguide.guide[i].shows[j].constructor === Object)
                //console.log(tvguide.guide[i].shows[j] + " is "+isEmptyObj)

                // if ( i==4) {
                //     console.log(tvguide.guide[i].shows);
                //     console.log(j, isEmptyObj)
                // }

                if (isEmptyObj) {
                    // keep track of js that shall be deleted
                    // delete from shows
                    tvguide.guide[i].shows.splice(j, 1);

                }
              }
            }
        }

        return tvguide;

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




/*******
old format when I was using spreadsheet reader


 init() {


       // instance.createTvGuide();
        // require('./spreadsheetReader.js')
        // .then(function(results){
        //     //console.log("THEN!!!")
        //     instance.channels = results;
        //     //console.log('channels:', channels);
        //     instance.createTvGuide();
        // })
        // .catch(function(err){
        //     //console.log("ERRAR", err);
        // });

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
                    // and get its length
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

    *********/
}
