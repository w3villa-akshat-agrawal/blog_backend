'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique constraint to 'email'
    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_email_constraint'
    });

    // Add unique constraint to 'username'
    await queryInterface.addConstraint('Users', {
      fields: ['username'],
      type: 'unique',
      name: 'unique_username_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove unique constraint from 'email'
    await queryInterface.removeConstraint('Users', 'unique_email_constraint');

    // Remove unique constraint from 'username'
    await queryInterface.removeConstraint('Users', 'unique_username_constraint');
  },
};
