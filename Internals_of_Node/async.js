const https = require('https');

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

// Although Libuv's threadpool contains 4 threads all the below code will be executed at the same time this is because libuv delegates low level operations
// to the underlying operating system
//the threadpool is not used
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
