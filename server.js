const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
//const request = require('request');

let filePath;
let videoFile;

process.on('message', (m) => {
  console.log('MESSAGE IN CHILD:', m);
  filePath = m.filePath;
  videoFile = m.videoFile;
  console.log('filePath:', filePath);
  console.log('videoFile:', videoFile);
});

const server = http.createServer((req, res) => {

  const decipher = crypto.createDecipher('aes192', 'kazazi12');

  console.log("FILEPATH IN SERVER: ", filePath);
  //const vidFileStream = fs.createReadStream(filePath);
  //const fileStats = fs.statSync(filePath);
  // const fileStats = fs.stat(filePath);
  //console.log("FILE SIZE:", fileStats.size);
  
  if (req.method === 'GET') {
    console.log('GET URL:', req.url);

    //let decrypted = '';
    
    if (req.url === '/' + videoFile) {
      fs.stat(filePath, (err, stats) => {
        // vidFileStream.pipe(decipher).pipe(res);
        console.log('hellooooooo');
        // vidFileStream.on('data', (chunk) => {
        //   console.log('chunk:', chunk);
        //   let decrypted = decipher.update(chunk);
        //   console.log('decrypted chunk:', chunk);
        //   res.end(decrypted);
        // });
        //res.end();

        // if (err) {
        //   if (err.code === 'ENOENT') {
        //     return res.sendStatus(404);
        //   }
        //   res.send(err);
        // }

        const range = req.headers.range;

        // if (!range) {
        //   return res.sendStatus(416);
        // }

        console.log('req.headers.range:', range);
        const positions = range.replace(/bytes=/, "").split("-");
        const start = parseInt(positions[0], 10);
        const fileSize = stats.size;
        const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
          "Content-Range": 'bytes ' + start + '-' + end + '/' + fileSize,
          "Accept-Ranges": 'bytes',
          "Content-Length": chunkSize,
          "Content-Type": 'video/mp4'
        });

        const vidFileStream = fs.createReadStream(filePath, { start, end });
        vidFileStream.on('open', () => {
          console.log('OPENED!'); 
          //vidFileStream.pipe(decipher).pipe(res);
          vidFileStream.on('data', (chunk) => {
            res.write(decipher.update(chunk, 'hex', 'utf8'));
          });

          vidFileStream.on('end', () => {
            res.end(decipher.final('utf8'));
          });
        }).on('error', (err) => {
          res.end(err);
        });
      });
    } else {
      //res.writeHead(200, )
      // res.statusCode = 200;
      // res.end();
      res.sendStatus(200);
    }
  }

});

server.listen(2462, '127.0.0.1');