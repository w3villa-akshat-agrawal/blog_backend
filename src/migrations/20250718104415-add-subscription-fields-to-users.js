'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    

    // Add 'subscriptionPlanId' column with foreign key
    await queryInterface.addColumn('Users', 'subscriptionPlanId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'SubscriptionPlans',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET DEFAULT', // optional, change as needed
    });

    // Add 'planActivatedAt' column
    await queryInterface.addColumn('Users', 'planActivatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add 'planExpiresAt' column
    await queryInterface.addColumn('Users', 'planExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns in reverse order
    await queryInterface.removeColumn('Users', 'planExpiresAt');
    await queryInterface.removeColumn('Users', 'planActivatedAt');
    await queryInterface.removeColumn('Users', 'subscriptionPlanId');
  }
};
