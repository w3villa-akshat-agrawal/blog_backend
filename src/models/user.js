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
      User.belongsTo(models.SubscriptionPlan, {
    foreignKey: 'subscriptionPlanId',
    as: 'subscription'
  });
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
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isEmailVerified: DataTypes.BOOLEAN,
  token: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  isActive: DataTypes.BOOLEAN,
  status: DataTypes.BOOLEAN,
  planActivatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  planExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'SubscriptionPlans',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'User',
});


  return User;
};
