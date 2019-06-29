var fs = require('fs');

// 异步
// fs.readFile('node调试工具简介.txt', 'utf-8', function(eor, data) {
//     if (eor) {
//         console.log(eor);
//     } else {
//         console.log(data);
//     }
// });
// console.log('end');
// 同步
var data = fs.readFileSync('node调试工具简介.txt', 'utf-8');
console.log(data);
console.log('end');