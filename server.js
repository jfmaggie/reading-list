var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var db = require('./models/index');
var User = require('./models/user')(db.sequelize, db.Sequelize);
var bodyParser = require('body-parser');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// #index
app.get('/users', function(req, res) {
  User.findAll().then(function(users) {
    res.json(users);
  });
});

// #show
app.get('/users/:id', function(req, res) {
  User.findById(req.params.id).then(function(user) {
    res.json(user);
  });
});

// #create
app.post('/users', function(req, res) {
  // res.json({ key: req.body });
  db.sequelize.sync().then(function() {
    return User.create({
      email: req.body.email,
      password: req.body.password
    });
  }).then(function(user) {
    res.json(user);
  });
});

// #update
app.put('/users/:id', function(req, res) {
  User.findById(req.params.id).then(function(user) {
    user.update(req.body).then(function() {
      res.json({ test: "success"});
    });
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
