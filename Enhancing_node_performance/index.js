const cluster = require('cluster'); //std library module

//is the file being executed in master mode
if (cluster.isMaster) {
  //cause index.js to be executed again but in child mode
  cluster.fork(); // every child has a group of 4 threads in the thread pool that can be used for computation
  cluster.fork();
} else {
  process.env.UV_THREADPOOL_SIZE = 1;
  //I am a child and am going to act like a server
  console.log(process.env.UV_THREADPOOL_SIZE);
  const express = require('express');
  const app = express();
  const crypto = require('crypto');

  console.log(cluster.isMaster);

  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hi there');
    });
  });

  app.get('/fast', (req, res) => {
    res.send('This was fast');
  });

  app.listen(3000, (req, res) => {
    console.log('You are connected to port 3000');
  });
}
