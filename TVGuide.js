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

var SPREADSHEET_ID = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var SRC_LOCATION = "/Volumes/WNPI_SRC/wnpi/";



let instance = null;

module.exports = class TvGuide {
    constructor () {
        if (!instance) {
            instance = this;
        }

        this.channels = [];
        this.curr_channel = 0;
        this.initialized = false;

        return instance;
    }
    

    createTvGuide() {

        instance.channels[1].print();

        // assume all folders rn
        for (let i=0; i<instance.channels.length; i++) {
            
        }
        for(let i in instance.channels) {
          for (let j in instance.channels[i]) {
            console.log(instance.channels[i][j])
            if ('content' in instance.channels[i][j]) {

              console.log(instance.channels[i][j]['content']);
              var folderName = instance.channels[i][j]['content'];
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
