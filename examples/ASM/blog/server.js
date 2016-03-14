//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

// Based on:
// http://howtonode.org/express-mongodb

var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var stylus = require('stylus');
var expressEjsLayouts = require('express-ejs-layouts');
var path = require('path');

var Blog = require('./blog').Blog;

var app = module.exports = express();

// Configuration

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(stylus.middleware({
  src: path.join(__dirname, 'public')
}));
app.use(express.static(path.join(__dirname, '/public')));

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

if ('production' === app.get('env')) {
  app.use(errorHandler());
}

// Routes

var blog = new Blog();
blog.init();

app.get('/', function (req, res) {
  blog.findAll(function (error, posts) {
    res.render('index.ejs', {
      title: 'Blog',
      posts: posts.entries
    });
  });
});

app.get('/blog/new', function (req, res) {
  res.render('blog_new.ejs', {
    title: 'New Blog Post'
  });
});

app.post('/blog/new', function (req, res) {
  blog.save({
    title: req.body.title,
    body: req.body.body
  }, function () {
    res.redirect('/');
  });
});

app.get('/blog/delete/:id', function (req, res) {
  blog.destroy(req.params.id, function () {
    res.redirect('/');
  });
});

app.get('/blog/:id', function (req, res) {
  blog.findById(req.params.id, function (error, post) {
    res.render('blog_show.ejs', {
      title: post.title._,
      post: post
    });
  });
});

app.listen(app.get('port'), function () {
  console.log(`Express server listening on port %d in %s mode`,
    app.get('port'),
    app.get('env'));
});
