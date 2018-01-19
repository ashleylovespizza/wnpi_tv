$(document).ready(function(){

// relative roots
  var USB_ROOT = "videos/" //"/Volumes/WNPI_SRC/wnpi/"
  var CARDIMAGES_ROOT = "cardimages/";
  var MIN_CARD_TIME = 1200;

  var lastChannelChange = new Date();
  var cardTimer = null;

  var tvPlayer = videojs('tv-player', {
    controls: false,
    autoplay: false,
    loop: false,
    preload: 'auto'
  });
  window.tvPlayer = tvPlayer;


  // OLD:
  // var channel_data = [
  //   { "video": "stallman.mkv",
  //     "startTime": 0,
  //     "cardbg": "channelcard_1.jpg",
  //     "showname": "Afternoon Matinee: Wall-E"
  //   }
  // ];

  // this is data brought over from JSON - all channels with all possible filenames
  var channel_data = new Array();

  // this is whatever is currently playing
  var current_state = new Array();

  // track your current channel globally  
  var currchannel;
  
  $.getJSON( "http://wnpi.local:3000/tvguide", function( data ) {
    var channels = data.guide;
    //console.log(channels)
    $.each( channels, function( key, val ) {
      channel_data.push( val );
    });

    setupTV()
  });


  function setupTV(){
     // console.log(channel_data)
      // start out with it turned on, first channel
      currchannel = 0;
      var turnedOnAt = new Date();
      // make initial channel_data object
      for (i in channel_data) {
        if (channel_data[i]['shows'].length > 0) {
          // select the first show to start with
          var current_state_for_this_channel = channel_data[i]['shows'][0];
          // keep track of which show in channel.shows is currently playing 
          // assuming all channels have at least one show, this initial setup should always work
          current_state_for_this_channel['show_i'] = 0;
          current_state_for_this_channel['startTime'] = turnedOnAt;

          current_state.push( current_state_for_this_channel )
        }
       
      }

      console.log("------");
      console.log(current_state)
      // INITIAL SHOW SET
      tvPlayer.src(USB_ROOT + (currchannel+1) + '/' + current_state[currchannel]['filename']);
 
      // initialize key listeners
      // TODO - debounce for remote
      $(document).keyup(function(e) {
        var code = e.keyCode || e.which;
         if(code == 38) { //Enter keycode
          //alert("up")
          changeChannel('up');
         }
         if(code == 40) { //Enter keycode
           //alert("DOWN")
          changeChannel('down');
         }
      });

        $("#up").click(function(){
          changeChannel('up');
        })

        $("#down").click(function(){
          changeChannel('down');
        })

    // videojs content listeners

    // TODO - event listener for when video completes while you're on that channel
    tvPlayer.on('ended', function(e) {
      // current 'show' ended

      playNextShowOnChannel();
    })

    tvPlayer.on('loadedmetadata', function(e){

        tvPlayer.pause();
        console.log("loaded META data!!!!", e)

        // TODO - may need to move this into channelChange();

        var currTime = new Date();
        var timeDiff = Math.abs(currTime.getTime() - current_state[currchannel]['startTime'].getTime());
        var diffSeconds = (timeDiff / (1000));
        channelChangedAt = currTime;

        var newtime;
   //     debugger;
        // if time passing since beginning is longer than entire "show" length
        if (diffSeconds > tvPlayer.duration()) {
          playNextShowOnChannel();
        } else {
          newtime = diffSeconds
        }
        console.log("play at "+newtime);

        tvPlayer.currentTime(newtime);
        tvPlayer.play(); 
    });

    tvPlayer.on('loadeddata', function(e){ 

    tvPlayer.pause();
      var now = new Date();
      var timeDiff = Math.abs(now.getTime() - lastChannelChange.getTime());
      console.log(timeDiff)
      if (timeDiff < MIN_CARD_TIME) {
        if (cardTimer != null) {
          clearTimeout(cardTimer);
          delete cardTimer;
          cardTimer = null;
        }
        cardTimer = setTimeout(function() {

          console.log("PLAY - AFTER TIMEOUT!")
          tvPlayer.play(); 
          console.log("loaded data!!!!", e)

         $("#card").removeClass("changechannel");
        }, (MIN_CARD_TIME - timeDiff));

      }
      else {
        tvPlayer.play(); 
        console.log("PLAY - your card has been up long enough")
       // console.log("loaded data!!!!", e)

       $("#card").removeClass("changechannel");
      }

    })


  }

  function playNextShowOnChannel() {
    var newStartTime = new Date();
    // find out next show

    var curr_show_i = current_state[currchannel]['show_i'];

    console.log("Now playing: show # "+current_state[currchannel]['show_i']);
    console.log(" out of a total possible " + (channel_data[currchannel]['shows']).length)


    console.log("---------- before, curr show i is: "+curr_show_i)
    curr_show_i++;
    if (curr_show_i >= (channel_data[currchannel]['shows']).length) { curr_show_i = 0; }
 //   debugger;

    console.log("curr show i is NOW: "+curr_show_i)

    // set correct starttime...
    // FOR NOW, just start the new file right now, ok man?
    var new_current_state_for_this_channel = channel_data[currchannel]['shows'][curr_show_i];
    // keep track of which show in channel.shows is currently playing 
    // assuming all channels have at least one show, this initial setup should always work
    new_current_state_for_this_channel['show_i'] = curr_show_i;
    new_current_state_for_this_channel['startTime'] = newStartTime;
 //   debugger;

    // update current state for this channel
    current_state[currchannel] = new_current_state_for_this_channel;

    console.log("STATE IS NOW:::::::::::")
    console.log(current_state[currchannel])
    // load src
    updateChannel();
  }


  // CHANNEL SWITCHING
  /////////////////////
  function updateChannel(){

    console.log("now play "+USB_ROOT + (currchannel+1) + '/' + current_state[currchannel]['filename'])
    tvPlayer.pause();
    tvPlayer.src(USB_ROOT + (currchannel+1) + '/' + current_state[currchannel]['filename']);
  }


  function showChannelCard() {
    console.log(CARDIMAGES_ROOT + channel_data[currchannel]['cardbg'])
    $("#card").css("background-image", 'url(' + CARDIMAGES_ROOT + channel_data[currchannel]['cardbg'] + ')')
    $("#channelnumber").html(currchannel+1);
    $("#card .currentshowtitle").html(current_state[currchannel]['filename']);
    $("#card .datetime").html( moment().format('dddd MMMM Do, h:mm a') )

    $("#card").addClass("changechannel");

  }

  function changeChannel(direction){
    lastChannelChange = new Date();
    if (direction == "up") {
      currchannel++;
      currchannel = currchannel % channel_data.length;

      showChannelCard();
      updateChannel();
    }
    else if (direction == "down") {
      currchannel--;
      currchannel = (currchannel < 0) ? channel_data.length-1 : currchannel;
      currchannel = currchannel % channel_data.length;

      showChannelCard();
      updateChannel();
    }
  }



  // POWER ON OFF
  //////////////////

  var onoffanimation = new TimelineMax({
    paused: true
  });
  
  onoffanimation
  .to($("#video-container"), .2, {
    width: '100vw',
    height: '2px',
    background: '#ffffff',
    ease: Power2.easeOut
  })
  .to($("video"), .2, {
    opacity: '0'
  }, '-=.2')
  .to($("#video-container"), .2, {
    width: '0',
    height: '0',
    background: '#ffffff'
  });

  $("#onoff").click(function(){
    $('#onoff').toggleClass('on');

    if ($("#onoff").hasClass("on")) {
      // on!
       onoffanimation.reverse();

      //$("#guard").removeClass("off");
      tvPlayer.play();
      updateChannel();
    } else {
      // turn off
    onoffanimation.restart();
      tvPlayer.pause();
      //$("#guard").addClass("off");
    }

  })


})