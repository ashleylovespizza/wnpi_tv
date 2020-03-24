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

    res.json( tvguide  );

    // for testing:
		// var foo = {
		// 	guide: [
		// 		{channel: 1,
		// 		 cardbg: 'channelcard_1.jpg',
		// 		 shows: [
		// 		 	{ filename: 'hudsonpark.mp4',
		// 		 	 showname: 'Hudson in the park'
		// 		 	},
		// 		 	// { filename: 'wallE.mp4',
		// 		 	//  showname: 'Wall-E'
		// 		 	// },
		// 		 	// { filename: 'LIGHT YEARS (aka Gandahar).mp4',
		// 		 	//  showname: 'Gandahar'
		// 		 	// }
		// 		 ]
		// 		},
		// 		{channel: 2,
		// 		 cardbg: 'channelcard_2.jpg',
		// 		 shows: [
		// 		 	{ filename: 'xmaskillkeytar_freezepop_show.mp4',
		// 		 	 showname: 'kill keytar'
		// 		 	},
		// 		 	{ filename: 'raspberryberet.mp4',
		// 		 	 showname: 'raspberry beret'
		// 		 	}
		// 		 ]
		// 		},
    //
		// 		{channel: 3,
		// 		 cardbg: 'channelcard_3.jpg',
		// 		 shows: [
		// 		 	{ filename: 'leysin.mp4',
		// 		 	 showname: 'leysin'
		// 		 	}
		// 		 ]
		// 		}
		// 	]}
	//	res.json( foo  );
	});
app.use('/', router);
