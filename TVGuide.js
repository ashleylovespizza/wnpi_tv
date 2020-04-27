"use strict";
/*
*   WNPI TV looper
*/
var moment = require('moment');
var fs = require('fs'),
    path = require('path');

// on mac -
//var SRC_LOCATION = "/Users/ashley/Projects/wnpi/wnpi_tv/app/videos/"


// on raspi -
var SRC_LOCATION = "/home/pi/wnpi/wnpi_tv/app/videos/";

var ADULT_SRC_LOCATION = SRC_LOCATION + "ADULT/";
var SWITCH_TO_ADULT_HOUR = 20;


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

    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
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


        if ( ((path.basename(filename) == 'videos')|| (path.basename(filename) == 'wnpi') || (path.basename(filename) == 'ADULT'))
             && (stats.isDirectory())  ) {
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

        } else if ( (path.basename(filename) == 'BORING') && stats.isDirectory() ) {
              // foldername is 'LATER
              info.channel = 'BORING';
              info.cardbg = 'channelcard_' + path.basename(filename) + '.jpg';

                  console.log("boring ")
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
       var tvguide;

       // start at first 'content' listing, go until next (wrapping around if necessary)
       if (fs.existsSync(SRC_LOCATION + ".DS_Store")) {
         fs.unlinkSync(SRC_LOCATION + ".DS_Store");
       }

       var now = new Date();
       console.log("adult hours?: "+ (now.getHours() >= SWITCH_TO_ADULT_HOUR));
       if ((now.getHours() >= SWITCH_TO_ADULT_HOUR)) {
         // it's ADULT HOURS
         console.log("it's ADULT TIME");
         SRC_LOCATION = ADULT_SRC_LOCATION;
       }
       tvguide = instance.dirTree(SRC_LOCATION);

       if ((now.getHours() >= SWITCH_TO_ADULT_HOUR)) {
         // it's ADULT HOURS
         tvguide.adultTime = true;
       }



        console.log("wtf");
        console.log(tvguide);

        for ( var i=0; i<tvguide.guide.length; i++) {
          console.log(i+" - i:")
          console.log(tvguide.guide[i])

          if (tvguide.guide[i] != {}) {
            for( var j=tvguide.guide[i].shows.length-1; j>-1; j--) {

                console.log(j+" - j:")

                var isEmptyObj = (Object.keys(tvguide.guide[i].shows[j]).length === 0 && tvguide.guide[i].shows[j].constructor === Object)

                if (isEmptyObj) {
                    // keep track of js that shall be deleted
                    // delete from shows
                    tvguide.guide[i].shows.splice(j, 1);

                }
              }
            }

            // randomize this shows array
            instance.shuffle(tvguide.guide[i].shows);
        }

        return tvguide;

    }
}
