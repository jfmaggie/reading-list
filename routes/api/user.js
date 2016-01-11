var express = require('express');
var apiRoutes = express.Router();
var db = require('../../models/index');
var User = require('../../models/user')(db.sequelize, db.Sequelize);
var jwt = require('jsonwebtoken');

// #login
apiRoutes.post('/login', function(req, res) {
  User.findOne({ where: { email: req.body.email } }).then(function(user) {
    if (user.comparePassword(req.body.password)) {
      // #login the user
      var token = jwt.sign({ id: user.id, email: user.email }, 'omgilovecats', {
        expiresIn: '1 day' // 24 hours
      });
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false, message: 'Authentication failed, wrong password.' })
    }
  });
});


// #index
apiRoutes.get('/users', function(req, res) {
  User.findAll().then(function(users) {
    res.json(users)
  });
});

// #show
apiRoutes.get('/users/:id', function(req, res) {
  User.findById(req.params.id).then(function(user) {
    res.json(user)
  });
});

// #create
apiRoutes.post('/users', function(req, res) {
  // res.json({ potato: req.body });
  User.create({
    email: req.body.email,
    password: req.body.password
  }).then(function(user) {
    res.json(user);
  });
});

// #update
apiRoutes.put('/users/:id', function(req, res) {
  User.findById(req.params.id).then(function(user) {
    user.update(req.body).then(function() {
      res.json({success: true});
    });
  });
});

// #delete
apiRoutes.delete('/users/:id', function(req, res) {
  User.findById(req.params.id).then(
    function(user) {
      user.destroy().then(
        // On success, let's let the front end know
        function() {
          res.json({ success: true });
        },
        // If for whatever reason our delete fails, let's let the front end know
        function() {
          res.json({ success: false });
        }
      );
    },
    function(error) {
      res.json({ error: error });
    }
  );
});

module.exports = apiRoutes;
