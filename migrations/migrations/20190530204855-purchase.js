'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('purchases', {
      albumId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    }),

  down: queryInterface => queryInterface.dropTable('purchases')
};
