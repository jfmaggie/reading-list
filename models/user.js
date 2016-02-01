'use strict';
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.List);
      }
    },
    instanceMethods: {
      comparePassword: function(password) {
        var hash = this.getDataValue('password');
        return bcrypt.compareSync(password, hash);
      }
    }
  });

  var hashPasswordHook = function(instance, options, done) {
    if (!instance.changed('password')) return done();
    bcrypt.hash(instance.get('password'), SALT_WORK_FACTOR, function (err, hash) {
      if (err) return done(err);
      instance.set('password', hash);
      done();
    });
  };

  User.beforeUpdate(hashPasswordHook);
  User.beforeCreate(hashPasswordHook);

  return User;
};
