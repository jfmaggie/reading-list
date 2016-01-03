var express = require('express');
var apiRoutes = express.Router();
var db = require('../../models/index');
var User = require('../../models/user')(db.sequelize, db.Sequelize);

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
