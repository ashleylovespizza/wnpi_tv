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
var INITIALIZED = false;
var CURR_CHANNEL = 0;
// let's not get too fancy yet
//var Channel = require('./channel.js');

var channels = [];


function onOffToggle() {
    if (INITIALIZED) {

    }
}

function changeChannel(new_channel) {
    if (INITIALIZED) {
        
    }
}

function createTvGuide() {

    channels[1].print();

    // todo - pre-create a JSON object representing the whole schedule

    INITIALIZED = true;
    while(1==1){
        
    }
}

function pullData() {

    require('./spreadsheetReader.js')
    .then(function(results){
        channels = results;
        //console.log('channels:', channels);
        createTvGuide();
    })
    .catch(function(err){ 
        console.log("ERRAR", err); 
    });

}
pullData();

