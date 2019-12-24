const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);
    const util = require('util');

    //causes client.get to return a promise
    client.get = util.promisify(client.get);

    //cached blog
    const cachedBlogs = await client.get(req.user.id);

    //if there are values cached then return the cached values
    if (cachedBlogs) {
      console.log('Serving from cache');
      res.send(JSON.parse(cachedBlogs));
    } else {
      // if not we should find the data in the database
      const blogs = await Blog.find({ _user: req.user.id });
      console.log('serving from mongo db');
      res.send(blogs);
      client.set(req.user.id, JSON.stringify(blogs));
    }
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
