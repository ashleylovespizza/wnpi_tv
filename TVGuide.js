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

        // todo - pre-create a JSON object representing the whole schedule

        instance.initialized = true;
        return {'tv': 'bar', 'baz': 'boo'};
        // while(1==1){
            
        // }
    }

    init() {

        require('./spreadsheetReader.js')
        .then(function(results){
            console.log("THEN!!!")
            instance.channels = results;
            //console.log('channels:', channels);
            instance.createTvGuide();
        })
        .catch(function(err){ 
            console.log("ERRAR", err); 
        });

    }

}
