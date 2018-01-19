require('babel-register');  
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/app'));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.listen(app.get('port'), function() {
});


var TVGuide = require('./TVGuide.js');
var my_guide = new TVGuide();

var router = express.Router();
// router.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });   
// });
router.route('/tvguide')
	.get(function(req, res) {
		var tvguide = my_guide.createTvGuide();
		console.log("oy");
		console.log(tvguide);
		var foo = { 
			guide: [
				{channel: 1,
				 cardbg: 'channelcard_1.jpg',
				 shows: [
				 	{ filename: 'flightofdragons.mp4',
				 	 showname: 'Flight of Dragons'
				 	},
				 	// { filename: 'wallE.mp4',
				 	//  showname: 'Wall-E'
				 	// },
				 	// { filename: 'LIGHT YEARS (aka Gandahar).mp4',
				 	//  showname: 'Gandahar'
				 	// }
				 ]
				},
				{channel: 2,
				 cardbg: 'channelcard_2.jpg',
				 shows: [
				 	{ filename: 'commercialtest.mp4',
				 	 showname: 'a weird german atari commercial'
				 	},
				 	{ filename: 'jewels.mp4',
				 	 showname: 'Beautiful JEWELES'
				 	}
				 ]
				},

				{channel: 3,
				 cardbg: 'channelcard_3.jpg',
				 shows: [
				 	{ filename: 'killerwhale.mp4',
				 	 showname: 'Jean-Michel Cousteau: Ocean Adventures<br><span>Call of the Killer Whale</span>'
				 	},
				 	{ filename: 'PBS.Independant.Lens.2013.Beauty.is.Embarrassing.540p.x264.AAC.MVGroup.org.mp4',
				 	 showname: 'Beauty Is Embarrassing'
				 	},
				 	{ filename: 'jacquecousteau.whales.mp4',
				 	 showname: 'The Undersea World of Jacque Cousteau: Whales'
				 	}
				 ]
				}
			]}
		res.json( tvguide  );
	});
app.use('/', router);
