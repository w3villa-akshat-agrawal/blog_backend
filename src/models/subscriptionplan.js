'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubscriptionPlan.hasMany(models.User, { foreignKey: 'subscriptionPlanId', as: 'users' });

    }
  }
  SubscriptionPlan.init({
    name: DataTypes.STRING,
    maxBlogsPerDay: DataTypes.INTEGER,
    canFollow: DataTypes.BOOLEAN,
    durationHours: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubscriptionPlan',
  });
  return SubscriptionPlan;
};