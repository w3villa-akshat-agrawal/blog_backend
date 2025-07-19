'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'planActivatedAt', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
    await queryInterface.changeColumn('Users', 'planExpiresAt', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'planActivatedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.changeColumn('Users', 'planExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
