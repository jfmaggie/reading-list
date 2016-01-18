var express = require('express');
var apiRoutes = express.Router();
var db = require('../../models/index');
var User = require('../../models/user')(db.sequelize, db.Sequelize);
var List = require('../../models/list')(db.sequelize, db.Sequelize);

// #create
apiRoutes.post('/lists', function(req, res) {
  List.create({
    name: req.body.name,
    userId: req.body.userId
  }).then(function(list) {
    res.json(list);
  });
});

module.exports = apiRoutes;
