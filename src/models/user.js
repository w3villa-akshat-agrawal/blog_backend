'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Blog, {
        foreignKey: 'userId',
        as: 'blogs'
      });
     User.hasMany(models.Comment, { foreignKey: 'commentUserId', as: 'userComments' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isEmailVerified: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
