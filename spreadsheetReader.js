var gsjson = require('google-spreadsheet-to-json');

var spreadsheetId = '1GWwkK9Phqy_kOh35o0MD36Ba97p9zW_YHf8oWEcCDl0';
var channels = ['0', '1', '2']

module.exports = gsjson({
    spreadsheetId: spreadsheetId,
    worksheet: channels
})
.then(function(result) {
    console.log(result.length);
   // console.log(result);
    channelData = result;
    //console.log(channelData);

    // assume all folders rn
    for(i in channelData) {
    	for (j in channelData[i]) {
    		if ('content' in channelData[i][j]) {

    			console.log(channelData[i][j]['content']);
    			var folderName = channelData[i][j]['content'];
    			FOLDERS[folderName] = [];

    			if (FOLDERS[folderName].length == 0) {
    				var files = fs.readdirSync(folderName);
    				for (f in files) {
    					if ( (/\.(avi|mov|mkv|mp4)$/i).test(files[f])) {
    						FOLDERS[folderName].push(files[f])
    					}

    				}

    			}
    			
    		}
    	}
    }


    console.log(FOLDERS)
})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});



