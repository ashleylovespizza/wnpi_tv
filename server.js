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
		foo = my_guide.createTvGuide();
		res.json(foo);
	});
app.use('/', router);
