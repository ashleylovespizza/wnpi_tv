$(document).ready(function(){

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
    autoplay: true,
    preload: 'auto'
  });

    var videos = [
    { "video": "videos/hustle.mp4",
      "startTime": 0
    },

    { "video": "videos/birdie.mp4",
      "startTime": 0
    },
    {"video": "videos/fuzzy.mp4", 
       "startTime": 0
     }, 

    { "video": "videos/moogf.mp4",
      "startTime": 0
    },

     {"video": "videos/affoa.mp4", 
      "startTime": 0
    },
    { "video": "videos/alchemy.mp4",
      "startTime": 0
    },
    { "video": "videos/agile.mp4",
      "startTime": 0
    },
    
    { "video": "videos/salt.mp4",
      "startTime": 0
    },
    { "video": "videos/extras.mp4",
      "startTime": 0
    }
    ];



  // start out with it turned on
  var currchannel = 0;
  var channelChangedAt = new Date();
  // INITIALLY set all starttimes to be when you turned it on (/loaded)
  for (i in videos) {
    videos[i]['startTime'] = channelChangedAt;
  }
  tvPlayer.src(videos[currchannel]['video']);



  // CHANNEL SWITCHING
  /////////////////////
  function updateChannel(){

    var currTime = new Date();
    var timeDiff = Math.abs(currTime.getTime() - videos[currchannel]['startTime'].getTime());

    var diffSeconds = (timeDiff / (1000));
    channelChangedAt = currTime;

    console.log("now play "+videos[currchannel]['video'])

    tvPlayer.src(videos[currchannel]['video']);
    var newtime = diffSeconds
    console.log("play at "+newtime);
   
    tvPlayer.on('loadedmetadata', function() {
      tvPlayer.currentTime(newtime);
      setTimeout(function() {
        $("#static").removeClass("changechannel");
      }, 300);
    });


    console.log(tvPlayer.currentTime())
  }


  $("#up").click(function(){
    $("#static").addClass("changechannel");
    currchannel++;
    currchannel = currchannel % videos.length;
    updateChannel();
  })


  $("#down").click(function(){
    $("#static").addClass("changechannel");

    currchannel--;
    currchannel = (currchannel < 0) ? videos.length-1 : currchannel;
    currchannel = currchannel % videos.length;
    updateChannel();
  })


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