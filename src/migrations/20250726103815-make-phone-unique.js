'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Ensure column exists and is configured
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Step 2: Add a unique constraint separately
    await queryInterface.addConstraint('Users', {
      fields: ['phone'],
      type: 'unique',
      name: 'unique_user_phone' // Custom name for better control
    });
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Remove the unique constraint first
    await queryInterface.removeConstraint('Users', 'unique_user_phone');

    // Step 2: Restore original column definition (if needed)
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
