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

    var videos = [
    { "video": "wallE.mp4",
      "startTime": 0
    },
    { "video": "killerwhale.mp4",
      "startTime": 0
    },

    { "video": "sesamestreet.mp4",
      "startTime": 0
    },
    
    { "video": "misterrogers.mp4",
      "startTime": 0
    },
     { "video": "bugsbunny.mp4",
      "startTime": 0
    },
     { "video": "flightofdragons.mp4",
      "startTime": 0
    },
     { "video": "startreks01e21.mp4",
      "startTime": 0
    },
    { "video": "columbo_lovelybutlethal.mp4",
      "startTime": 0
    },


    // { "video": "birdie.mp4",
    //   "startTime": 0
    // },
    // {"video": "videos/fuzzy.mp4", 
    //    "startTime": 0
    //  }, 

    // { "video": "videos/moogf.mp4",
    //   "startTime": 0
    // },

    //  {"video": "videos/affoa.mp4", 
    //   "startTime": 0
    // },
    // { "video": "videos/alchemy.mp4",
    //   "startTime": 0
    // },
    // { "video": "videos/agile.mp4",
    //   "startTime": 0
    // },
    
    // { "video": "videos/salt.mp4",
    //   "startTime": 0
    // },
    // { "video": "videos/extras.mp4",
    //   "startTime": 0
    // }
    ];



  // start out with it turned on
  var currchannel = 0;
  var channelChangedAt = new Date();
  // INITIALLY set all starttimes to be when you turned it on (/loaded)
  for (i in videos) {
    videos[i]['startTime'] = channelChangedAt;
  }
  tvPlayer.src(USB_ROOT + videos[currchannel]['video']);

  tvPlayer.on('loadedmetadata', function() {
      tvPlayer.currentTime(0);
      setTimeout(function() {
        $("#static").removeClass("changechannel");
      }, 300);
  });


  // CHANNEL SWITCHING
  /////////////////////
  function updateChannel(){

    var currTime = new Date();
    var timeDiff = Math.abs(currTime.getTime() - videos[currchannel]['startTime'].getTime());

    var diffSeconds = (timeDiff / (1000));
    channelChangedAt = currTime;

    console.log("now play "+USB_ROOT + videos[currchannel]['video'])

    tvPlayer.src(USB_ROOT + videos[currchannel]['video']);
    var newtime = diffSeconds
    console.log("play at "+newtime);

   
    tvPlayer.on('loadedmetadata', function() {
      tvPlayer.currentTime(newtime);
      setTimeout(function() {
        $("#static").removeClass("changechannel");
      }, 300);

      // var tvW = tvPlayer.videoWidth();
      // var tvH = tvPlayer.videoHeight();

      // var browserW = $("#video-container").width()
      // var browserH = $("#video-container").height()

    //console.log("video W: " + tvPlayer.videoWidth() + ", browser width: "+$("#video-container").width())
    //console.log("video H: " + tvPlayer.videoHeight() + ", browser width: "+$("#video-container").height())

    // console.log("video ratio is "+ Number(tvH/tvW) )
    // console.log("browser ratio is "+ Number(browserH/browserW));

    // if video ratio > browser ratio, taller than wide (space on left/right)
    // else , wider than tall (space on top/bottom)
      // if ( (tvH/tvW) > (browserH/browserW) ) {
      //   // taller than wide, space on left/right

      //   // stretch video
      // } else {
      //   //  wider than tall (space on top/bottom)
      // }
    });


    console.log(tvPlayer.currentTime())
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


  function changeChannel(direction){
    if (direction == "up") {
       $("#static").addClass("changechannel");
      currchannel++;
      currchannel = currchannel % videos.length;
      updateChannel();
    }
    else if (direction == "down") {
        $("#static").addClass("changechannel");

      currchannel--;
      currchannel = (currchannel < 0) ? videos.length-1 : currchannel;
      currchannel = currchannel % videos.length;
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