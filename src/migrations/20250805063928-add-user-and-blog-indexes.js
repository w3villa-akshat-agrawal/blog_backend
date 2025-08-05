'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add index on Users.email
    await queryInterface.addIndex('Users', ['email'], {
      name: 'users_email_index',
      unique: true
    });

    // Add index on Users.id (optional if not already primary key)
    await queryInterface.addIndex('Users', ['id'], {
      name: 'users_id_index'
    });

    // Add index on Blogs.userId
    await queryInterface.addIndex('Blogs', ['userId'], {
      name: 'blogs_userId_index'
    });

    // Add index on Blogs.id (optional — already indexed if primary key)
    await queryInterface.addIndex('Blogs', ['id'], {
      name: 'blogs_id_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_email_index');
    await queryInterface.removeIndex('Users', 'users_id_index');
    await queryInterface.removeIndex('Blogs', 'blogs_userId_index');
    await queryInterface.removeIndex('Blogs', 'blogs_id_index');
  }
};
