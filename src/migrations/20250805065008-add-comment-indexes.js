'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Comments', ['blogId'], {
      name: 'idx_comments_blogId',
    });

    await queryInterface.addIndex('Comments', ['createdAt'], {
      name: 'idx_comments_createdAt',
    });

    // Optional: Composite index if you always use WHERE blogId AND ORDER BY createdAt
    await queryInterface.addIndex('Comments', ['blogId', 'createdAt'], {
      name: 'idx_comments_blogId_createdAt',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Comments', 'idx_comments_blogId');
    await queryInterface.removeIndex('Comments', 'idx_comments_createdAt');
    await queryInterface.removeIndex('Comments', 'idx_comments_blogId_createdAt');
  }
};
