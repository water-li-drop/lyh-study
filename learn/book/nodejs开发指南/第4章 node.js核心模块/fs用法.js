var fs = require('fs');

// fs.readFile(filename,[encoding],[callback(err,data)]) 是最简单的读取文件的函数
// fs.readFile('util用法.js', 'utf-8', function(err, data) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(data);
//     }
// });
// fs.readFileSync(filename, [encoding])
// console.log(fs.readFileSync('util用法.js', 'utf-8'));

// fs.open(path, flags, [mode], [callback(err, fd)]) 是 POSIX  open 函数的封装，与 C 语言标准库中的  fopen 函数类似。它接受两个必选参数， path 为文件的路径，
// fs.open('test.txt', 'w', 0666, function(err, fd) {
//     console.log(fd);
// });

// fs.read(fd, buffer, offset, length, position, [callback(err, bytesRead,buffer)]) 是 POSIX  read 函数的封装，相比  fs.readFile 提供了更底层的接口。 
// fs.read的功能是从指定的文件描述符  fd 中读取数据并写入  buffer 指向的缓冲区对象
// fs.read(fd, buf, 0, 8, null, function(err, bytesRead, buffer) {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('bytesRead: ' + bytesRead);
//     console.log(buffer);
// })