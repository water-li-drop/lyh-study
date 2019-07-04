const fs = require('fs');
var temp = 'erwqrewqrewqrew';
fs.watchFile('ceshi.html', temp, function(err, data) {
    console.log(data);
});