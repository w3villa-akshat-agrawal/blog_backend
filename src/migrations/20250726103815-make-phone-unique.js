'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });
  }
};
