'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author'
      });
      Blog.hasMany(models.Comment, { foreignKey: 'blogId', as: 'comments' });
    }
  }

  Blog.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    type: DataTypes.ENUM('public', 'private'),
    userId: DataTypes.INTEGER,
    image: {
  type: DataTypes.STRING,
  allowNull: true
}
  }, {
    sequelize,
    modelName: 'Blog',
  });

  return Blog;
};
