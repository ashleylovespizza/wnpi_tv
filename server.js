require('babel-register');  
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/app'));

app.listen(app.get('port'), function() {
});


var TVGuide = require('./TVGuide.js');
var my_guide = new TVGuide();
my_guide.init();
var router = express.Router();
// router.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });   
// });
router.route('/tvguide')
	.get(function(req, res) {
		//foo = my_guide.createTvGuide();
		var foo = { 
			guide: [
				{channel: 1,
				 shows: [
				 	{ filename: 'flightofdragons.mp4',
				 	 showname: 'Flight of Dragons'
				 	},
				 	{ filename: 'wallE.mp4',
				 	 showname: 'Wall-E'
				 	},
				 	{ filename: 'LIGHT YEARS (aka Gandahar).mp4',
				 	 showname: 'Gandahar'
				 	}
				 ]
				},
				{channel: 2,
				 shows: [
				 	{ filename: 'flightofdragons.mp4',
				 	 showname: 'Flight of Dragons'
				 	},
				 	{ filename: 'wallE.mp4',
				 	 showname: 'Wall-E'
				 	},
				 	{ filename: 'LIGHT YEARS (aka Gandahar).mp4',
				 	 showname: 'Gandahar'
				 	}
				 ]
				},

				{channel: 4,
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
		res.json( foo  );
	});
app.use('/', router);
