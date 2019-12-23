process.env.UV_THREADPOOL_SIZE = 1;

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(Date.now() - start);
      });
    })
    .end();
}

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start);
  });
}

// os operation does not utilize the thread pool
doRequest();

//operation utilizes the thread pool
fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
});

//operation utilizes the thread pool
doHash();
doHash();
doHash();
doHash();
