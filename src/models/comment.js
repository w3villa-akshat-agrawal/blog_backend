'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Blog, { foreignKey: 'blogId', as: 'blog' });
      Comment.belongsTo(models.User, { foreignKey: 'commentUserId', as: 'commentAuthor' });
    }
  }
  Comment.init({
    comment: DataTypes.TEXT,
    blogId: DataTypes.INTEGER,
    commentUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
