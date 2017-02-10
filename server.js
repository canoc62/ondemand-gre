const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
//const request = require('request');

let filePath;
let videoFile;

process.on('message', (m) => {
  console.log('MESSAGE IN CHILD:', m);
  filePath = m.filePath;
  //filePath = 'decryptedVid.mp4';
  videoFile = m.videoFile;
  console.log('filePath:', filePath);
  console.log('videoFile:', videoFile);
});

const server = http.createServer((req, res) => {

  const decipher = crypto.createDecipher('aes-256-ctr', 'kazazi12');

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

        if (err) {
          if (err.code === 'ENOENT') {
            // 404 Error if file not found
            return res.sendStatus(404);
          }
        res.end(err);
        }
        const range = req.headers.range;

        if (!range) {
          return res.sendStatus(416);
        }

        const positions = range.replace(/bytes=/, "").split("-");
        const start = parseInt(positions[0], 10);
        const fileSize = stats.size;
        console.log('FILE SIZE:', fileSize);
        const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;


        res.writeHead(206, {
          "Content-Range": 'bytes ' + start + '-' + end + '/' + fileSize,
          //"Content-Range": 'bytes ' + 0 + '-' + 500 + '/' + fileSize,
          "Accept-Ranges": 'bytes',
          "Content-Length": chunkSize,
          "Content-Type": 'video/mp4',
          'Content-disposition': 'attachment; filename=' + videoFile
        });
        //res.setHeader('Content-disposition', 'attachment; filename=' + videoFile);

        //const vidFileStream = fs.createReadStream(filePath, { autoClose: true, start, end });
        //const vidFileStream = fs.createReadStream('/Users/canoc/Coding/codesmith/production_project/offline-gre copy/videos/');
        const vidFileStream = fs.createReadStream(filePath);
        const output = fs.createWriteStream('decryptedFromServer.mp4');
        //vidFileStream.pipe(decipher).pipe(res);
        vidFileStream.on('open', () => {
          console.log('OPENED!'); 
          vidFileStream.pipe(decipher).pipe(output);
          vidFileStream.pipe(decipher).pipe(res);
          //vidFileStream.pipe(res);


        //   decipher.on('readable', () => {
        //     const data = decipher.read();

        //     if (data) {
        //       res.write(data);
        //     }
        //   });

        // decipher.on('data', (chunk) => {
        //   res.write(chunk.toString('base64'));
        // });

        //   vidFileStream.on('data', (chunk) => {
        //     //console.log('DECRYPTED CHUNK:', chunk.toString('hex'));
        //     res.write(decipher.update(chunk, 'binary', 'binary'));
          
            
        // //     //res.write(decipher.update(chunk));
        // //     decipher.write(chunk);
        // //   });

        //   vidFileStream.on('end', () => {
        //     //decipher.end();
        //     //res.end();
        //     res.end(decipher.final('binary'), 'binary');
        //   });
        })
        .on('error', (err) => {
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