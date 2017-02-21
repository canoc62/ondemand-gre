const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

let filePath;
let videoFile;
let key;
let iv;

process.on('message', (m) => {
  console.log('MESSAGE IN CHILD KEY:', Buffer.from(m.key));
  console.log('MESSAGE IN CHILD IV:', Buffer.from(m.iv));
  filePath = m.filePath;
  //filePath = 'outputDecrypted.mp4';
  //filePath = 'decryptedVid.mp4';
  //filePath = 'encryptedVid.mp4';
  videoFile = m.videoFile;
  key = Buffer.from(m.key);//new Buffer(m.key);
  iv = Buffer.from(m.iv);//new Buffer(m.iv);
  console.log('filePath:', filePath);
  console.log('videoFile:', videoFile);
});

const server = http.createServer((req, res) => {

  // const decipher = crypto.createDecipher('aes-256-ctr', '');
  
  if (req.method === 'GET') {

    if (req.url === '/' + videoFile) {
      fs.stat(filePath, (err, stats) => {

        if (err) {
          if (err.code === 'ENOENT') {
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
        console.log('START:', start);
        const fileSize = stats.size;
        const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
        console.log('END:', end);
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
          "Content-Range": 'bytes ' + start + '-' + end + '/' + fileSize,
          "Accept-Ranges": 'bytes',
          "Content-Length": chunkSize,
          "Content-Type": 'video/mp4',
        });
        
        const vidFileStream = fs.createReadStream(filePath, { start, end });
        //const output = fs.createWriteStream('outputDecrypted.mp4');
        //vidFileStream.on('open', () => {
          console.log('OPENED!'); 
          //vidFileStream.pipe(decipher).pipe(output);
          //const decipher = crypto.createDecipher('aes-256-ctr', '');
          //vidFileStream.pipe(decipher).pipe(res);
          //vidFileStream.pipe(res);

          // const key = crypto.pbkdf2Sync('password', 'salt', 1000, 32);
          // const iv = new Buffer(crypto.randomBytes(16), 'binary');
          const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
          vidFileStream.pipe(decipher).pipe(res);
        //})
        // .on('error', (err) => {
        //   res.end(err);
        // });


        // use sid from progress.json instead of ajax call for pw
        // get salt from json filePath
        //     const key = crypto.pbkdf2(sid, salt, 1000, 32, 'sha512', (err, key) => {
        //      const decipher = crypto.createDecipheriv('aes-256-ctr', key, salt);
        //      req.pipe(decipher).pipe(res);
        //     })
      });
    } else {
      res.sendStatus(200);
    }
  }
});

server.listen(2462, '127.0.0.1');