$(document).ready(function(){


  var USB_ROOT = "videos/" //"/Volumes/WNPI_SRC/wnpi/"

  // TIMELINE
  ///////////////
  var timeline = new TimelineMax({
    paused: true
  });
  
  timeline
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



  var tvPlayer = videojs('tv-player', {
    controls: false,
    autoplay: false,
    loop: true,
    preload: 'auto'
  });
  window.tvPlayer = tvPlayer;

  var videos = [
    { "video": "wallE.mp4",
      "startTime": 0,
      "cardbg": "channelcard_1.jpg",
      "showname": "Afternoon Matinee: Wall-E"
    },
    { "video": "killerwhale.mp4",
      "startTime": 0,
      "cardbg": "channelcard_2.jpg",
      "showname": "Jean-Michel Cousteau: Ocean Adventures<br><span>Call of the Killer Whale</span>"
    },
    { "video": "sesamestreet.mp4",
      "startTime": 0,
      "cardbg": "channelcard_3.jpg",
      "showname": "Sesame Street"
    },  
    { "video": "misterrogers.mp4",
      "startTime": 0,
      "cardbg": "channelcard_4.jpg",
      "showname": "Mister Rogers' Neighborhood"
    },
     { "video": "bugsbunny.mp4",
      "startTime": 0,
      "cardbg": "channelcard_5.jpg",
      "showname": "Loony Tunes"
    },
     { "video": "flightofdragons.mp4",
      "startTime": 0,
      "cardbg": "channelcard_6.gif",
      "showname": "<span>WNPI Presents:</span> Flight of Dragons"
    },
     { "video": "startreks01e21.mp4",
      "startTime": 0,
      "cardbg": "channelcard_7.gif",
      "showname": "Star Trek: The Next Generation <br><span>The Arsenal of Freedom (Season 1, Episode 20)</span>"
    },
    { "video": "columbo_lovelybutlethal.mp4",
      "startTime": 0,
      "cardbg": "channelcard_8.jpg",
      "showname": "Columbo: Lovely But Lethal <span>(Season 3)</span>"
    },
  ];



  // start out with it turned on
  var currchannel = 0;
  var channelChangedAt = new Date();
  // INITIALLY set all starttimes to be when you turned it on (/loaded)
  for (i in videos) {
    videos[i]['startTime'] = channelChangedAt;
  }

  // INITIAL CHANNEL SET
  tvPlayer.src(USB_ROOT + videos[currchannel]['video']);
  // tvPlayer.on('loadedmetadata', function() {
  //     tvPlayer.currentTime(0);
  //     setTimeout(function() {
  //       tvPlayer.play();
  //       $("#channel").removeClass("changechannel");
  //     }, 300);
  // });


  // todo - do i need this?
    tvPlayer.on('loadedmetadata', function(e){

        console.log("loaded META data!!!!", e)

        var currTime = new Date();
        var timeDiff = Math.abs(currTime.getTime() - videos[currchannel]['startTime'].getTime());
        var diffSeconds = (timeDiff / (1000));
        channelChangedAt = currTime;

        var newtime = diffSeconds
        console.log("play at "+newtime);

        // TODO - duration mod with curr time for looping time

        tvPlayer.currentTime(newtime);
        tvPlayer.play(); 
    });

    tvPlayer.on('loadeddata', function(e){ 
      tvPlayer.play(); 
        console.log("loaded data!!!!", e)

       // $("#card").removeClass("changechannel");

    })


  // CHANNEL SWITCHING
  /////////////////////
  function updateChannel(){

    console.log("now play "+USB_ROOT + videos[currchannel]['video'])

    tvPlayer.src(USB_ROOT + videos[currchannel]['video']);
    


  }


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

  function showChannelCard() {
    $("#card").css("background-image", 'url(/images/' + videos[currchannel]['cardbg'] + ')')
    $("#channelnumber").html(currchannel+1);
    $("#card .currentshowtitle").html(videos[currchannel]['showname']);
    $("#card .datetime").html( moment().format('dddd MMMM Do, h:mm a') )

    $("#card").addClass("changechannel");
  }

  function changeChannel(direction){
    if (direction == "up") {
      currchannel++;
      currchannel = currchannel % videos.length;

      showChannelCard();
      updateChannel();
    }
    else if (direction == "down") {
      currchannel--;
      currchannel = (currchannel < 0) ? videos.length-1 : currchannel;
      currchannel = currchannel % videos.length;

      showChannelCard();
      updateChannel();
    }
  }



  // POWER ON OFF
  //////////////////
  $("#onoff").click(function(){
    $('#onoff').toggleClass('on');

    if ($("#onoff").hasClass("on")) {
      // on!
       timeline.reverse();

      //$("#guard").removeClass("off");
      tvPlayer.play();
      updateChannel();
    } else {
    	// turn off
		timeline.restart();
      tvPlayer.pause();
      //$("#guard").addClass("off");
    }

  })


})