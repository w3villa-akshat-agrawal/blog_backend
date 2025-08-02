'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add column without FK
    await queryInterface.addColumn('Users', 'subscriptionPlanId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    // Step 2: Add FK constraint
    await queryInterface.addConstraint('Users', {
      fields: ['subscriptionPlanId'],
      type: 'foreign key',
      name: 'fk_users_subscription_plan_id',
      references: {
        table: 'SubscriptionPlans',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET DEFAULT'
    });

    // Step 3: Add planActivatedAt
    await queryInterface.addColumn('Users', 'planActivatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Step 4: Add planExpiresAt
    await queryInterface.addColumn('Users', 'planExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop constraint first
    await queryInterface.removeConstraint('Users', 'fk_users_subscription_plan_id');

    // Then drop columns
    await queryInterface.removeColumn('Users', 'planExpiresAt');
    await queryInterface.removeColumn('Users', 'planActivatedAt');
    await queryInterface.removeColumn('Users', 'subscriptionPlanId');
  }
};
