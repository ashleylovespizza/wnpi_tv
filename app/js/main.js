$(document).ready(function(){



    var camera, scene, renderer;
    var video, videoTexture,videoMaterial;
    var composer;
    var shaderTime = 0;
    var badTVParams, badTVPass;   
    var staticParams, staticPass;   
    var rgbParams, rgbPass; 
    var filmParams, filmPass; 
    var renderPass, copyPass;
    var gui;
    var pnoise, globalParams;


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


    init();
    animate();


    function init() {

      camera = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
      camera.position.z = 1000;
      scene = new THREE.Scene();

      //Load Video
      video = document.createElement( 'video' );
      video.loop = true;
      video.src = videos[currchannel]['video'];
      video.play();


      //init video texture
      videoTexture = new THREE.Texture( video );
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      videoMaterial = new THREE.MeshBasicMaterial( {
        map: videoTexture
      } );

      //Add video plane
      var planeGeometry = new THREE.PlaneGeometry( 1080, 720,1,1 );
      var plane = new THREE.Mesh( planeGeometry, videoMaterial );
      scene.add( plane );
      plane.z = 0;
      plane.scale.x = plane.scale.y = 1.45;

      // // add text plane
      // var loader = new THREE.FontLoader();

      // loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

      //   var geometry = new THREE.TextGeometry( 'CHANNEL 3', {
      //     font: font,
      //     size: 80,
      //     height: 5,
      //     curveSegments: 12,
      //     bevelEnabled: true,
      //     bevelThickness: 10,
      //     bevelSize: 8,
      //     bevelSegments: 5
      //   } );
      // } );


      //add stats
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      container.appendChild( stats.domElement );

      //init renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setSize( 800, 600 );
      document.getElementById("canvas").appendChild( renderer.domElement );

      //POST PROCESSING
      //Create Shader Passes
      renderPass = new THREE.RenderPass( scene, camera );
      badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
      rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
      filmPass = new THREE.ShaderPass( THREE.FilmShader );
      staticPass = new THREE.ShaderPass( THREE.StaticShader );
      copyPass = new THREE.ShaderPass( THREE.CopyShader );

      //set shader uniforms
      filmPass.uniforms.grayscale.value = 0;

      //Init DAT GUI control panel
      badTVParams = {
        mute:false,
        show: true,
        distortion: 3.0,
        distortion2: 1.0,
        speed: 0.3,
        rollSpeed: 0.1
      };

      staticParams = {
        show: true,
        amount:0.5,
        size:4.0
      };

      rgbParams = {
        show: true,
        amount: 0.005,
        angle: 0.0,
      };

      filmParams = {
        show: true,
        count: 800,
        sIntensity: 0.9,
        nIntensity: 0.4
      };

      gui = new dat.GUI();
      
      gui.add(badTVParams, 'mute').onChange(onToggleMute);

      var f1 = gui.addFolder('Bad TV');
      f1.add(badTVParams, 'show').onChange(onToggleShaders);
      f1.add(badTVParams, 'distortion', 0.1, 20).step(0.1).listen().name('Thick Distort').onChange(onParamsChange);
      f1.add(badTVParams, 'distortion2', 0.1, 20).step(0.1).listen().name('Fine Distort').onChange(onParamsChange);
      f1.add(badTVParams, 'speed', 0.0,1.0).step(0.01).listen().name('Distort Speed').onChange(onParamsChange);
      f1.add(badTVParams, 'rollSpeed', 0.0,1.0).step(0.01).listen().name('Roll Speed').onChange(onParamsChange);
      f1.open();

      var f2 = gui.addFolder('RGB Shift');
      f2.add(rgbParams, 'show').onChange(onToggleShaders);
      f2.add(rgbParams, 'amount', 0.0, 0.1).listen().onChange(onParamsChange);
      f2.add(rgbParams, 'angle', 0.0, 2.0).listen().onChange(onParamsChange);
      f2.open();

      var f4 = gui.addFolder('Static');
      f4.add(staticParams, 'show').onChange(onToggleShaders);
      f4.add(staticParams, 'amount', 0.0,1.0).step(0.01).listen().onChange(onParamsChange);
      f4.add(staticParams, 'size', 1.0,100.0).step(1.0).onChange(onParamsChange);
      f4.open();

      var f3 = gui.addFolder('Scanlines');
      f3.add(filmParams, 'show').onChange(onToggleShaders);
      f3.add(filmParams, 'count', 50, 1000).onChange(onParamsChange);
      f3.add(filmParams, 'sIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
      f3.add(filmParams, 'nIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
      f3.open();

      gui.close();

      onToggleShaders();
      onToggleMute();
      onParamsChange();

      window.addEventListener('resize', onResize, false);
      renderer.domElement.addEventListener('click', randomizeParams, false);
      onResize();
      randomizeParams();
    }

    function onParamsChange() {

      //copy gui params into shader uniforms
      badTVPass.uniforms[ 'distortion' ].value = badTVParams.distortion;
      badTVPass.uniforms[ 'distortion2' ].value = badTVParams.distortion2;
      badTVPass.uniforms[ 'speed' ].value = badTVParams.speed;
      badTVPass.uniforms[ 'rollSpeed' ].value = badTVParams.rollSpeed;

      staticPass.uniforms[ 'amount' ].value = staticParams.amount;
      staticPass.uniforms[ 'size' ].value = staticParams.size;

      rgbPass.uniforms[ 'angle' ].value = rgbParams.angle*Math.PI;
      rgbPass.uniforms[ 'amount' ].value = rgbParams.amount;

      filmPass.uniforms[ 'sCount' ].value = filmParams.count;
      filmPass.uniforms[ 'sIntensity' ].value = filmParams.sIntensity;
      filmPass.uniforms[ 'nIntensity' ].value = filmParams.nIntensity;
    }

    var randomizer = 0;
    function randomizeParams() {
      randomizer++;

      if (randomizer%3 == 0) {
        console.log("fixed");
        //you fixed it!
        badTVParams.distortion = 0.1;
        badTVParams.distortion2 =0.1 + Math.random()*.6;
        badTVParams.speed =0;
        badTVParams.rollSpeed =0;
        rgbParams.angle = 0;
        rgbParams.amount = 0;
        staticParams.amount =  Math.random()*.07;

      } else if (randomizer%4 == 0) {
        console.log("REALLY fixed");
        //you fixed it!
        badTVParams.distortion = 0;
        badTVParams.distortion2 =0;
        badTVParams.speed =0;
        badTVParams.rollSpeed =0;
        rgbParams.angle = 0;
        rgbParams.amount = 0;
        staticParams.amount =  0.0001;
      //   staticParams.show = false;
      //   badTVParams.show = false;
      //   rgbParams.show = false;
      filmParams.show = false
       onToggleShaders();

      } 
      else {
        badTVParams.distortion = Math.random()*10+0.1;
        badTVParams.distortion2 =Math.random()*10+0.1;
        badTVParams.speed =Math.random()*0.4;
        badTVParams.rollSpeed =Math.random()*0.2;
        rgbParams.angle = Math.random()*2;
        rgbParams.amount = Math.random()*0.03;
        staticParams.amount = Math.random()*0.2;
      }

      onParamsChange();
    }

    function onToggleMute(){
      video.volume  = badTVParams.mute ? 0 : 1;
    }

    function onToggleShaders(){

      //Add Shader Passes to Composer
      //order is important 
      composer = new THREE.EffectComposer( renderer);
      composer.addPass( renderPass );



      if (filmParams.show){
        composer.addPass( filmPass );
      }

      if (badTVParams.show){
        composer.addPass( badTVPass );
      }

      if (rgbParams.show){
        composer.addPass( rgbPass );
      }

      if (staticParams.show){
        composer.addPass( staticPass );
      }

      composer.addPass( copyPass );
      copyPass.renderToScreen = true;
    }

    function animate() {

      shaderTime += 0.1;
      badTVPass.uniforms[ 'time' ].value =  shaderTime;
      filmPass.uniforms[ 'time' ].value =  shaderTime;
      staticPass.uniforms[ 'time' ].value =  shaderTime;

      if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
        if ( videoTexture ) videoTexture.needsUpdate = true;
      }

      requestAnimationFrame( animate );
      composer.render( 0.1);
      stats.update();
    }

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }






  // // tvPlayer.src(videos[currchannel]['video']);


  var channuminterval = null;
  // CHANNEL SWITCHING
  /////////////////////
  function updateChannel(){
      $("#channelnum").removeClass('visible');
    clearInterval(channuminterval);
    channuminterval = null;


    var currTime = new Date();
    var timeDiff = Math.abs(currTime.getTime() - videos[currchannel]['startTime'].getTime());

    var diffSeconds = (timeDiff / (1000));
    channelChangedAt = currTime;

    console.log("now play "+videos[currchannel]['video'])

   /// tvPlayer.src(videos[currchannel]['video']); 
   video.pause();
      video.src = videos[currchannel]['video'];
      video.load();

    $("#channelnum").html(String(currchannel+1))
    $("#channelnum").addClass('visible');
    channuminterval = setInterval(function(){
      $("#channelnum").removeClass('visible');
    }, 1200);
    ///////video.src = videos[currchannel]['video'];
    console.log(video)

    var newtime = diffSeconds
    console.log("play at "+newtime);

    video.addEventListener('loadedmetadata', function() {

      this.currentTime = newtime;
        setTimeout(function() {

      video.play();
        $("#static").removeClass("changechannel");
      }, 300);

    }, false);


    // tvPlayer.on('loadedmetadata', function() {
    //   tvPlayer.currentTime(newtime);
    
    // });


    // console.log(tvPlayer.currentTime())
  }


function channelChange() {
  $("#static").addClass("changechannel");
    currchannel++;
    currchannel = currchannel % videos.length;
    updateChannel();
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        channelChange();
    }
    else if (e.keyCode == '40') {
        // down arrow
         $("#static").addClass("changechannel");

        currchannel--;
        currchannel = (currchannel < 0) ? videos.length-1 : currchannel;
        currchannel = currchannel % videos.length;
        updateChannel();

    }
    else if (e.keyCode == '32') {
      //space
      $("#onoff").click();
    }
   else if (e.keyCode == '49' 
          || e.keyCode == '50' 
          || e.keyCode == '51' 
          || e.keyCode == '52' 
          || e.keyCode == '53' 
          || e.keyCode == '54' 
          || e.keyCode == '55' 
          || e.keyCode == '56' 
          || e.keyCode == '57' ) {
    // 1
  console.log("alksdfjlkfj"+e.keyCode)
    currchannel = Number(e.keyCode) - 49;
    updateChannel();
   }

}



  $("#up").click(channelChange)


  $("#down").click(function(){
    $("#static").addClass("changechannel");

    currchannel--;
    currchannel = (currchannel < 0) ? videos.length-1 : currchannel;
    currchannel = currchannel % videos.length;
    updateChannel();
  })


  // ON/OFF TIMELINE
  ///////////////
  var onofftimeline = new TimelineMax({
    paused: true
  });
  
  onofftimeline
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


  // POWER ON OFF
  //////////////////
  $("#onoff").click(function(){
    $('#onoff').toggleClass('on');

    if ($("#onoff").hasClass("on")) {
      // on!
       onofftimeline.reverse();

      //$("#guard").removeClass("off");
      video.play();
      updateChannel();
    } else {
      // turn off
    onofftimeline.restart();
      video.pause();
      //$("#guard").addClass("off");
    }

  })
  


})