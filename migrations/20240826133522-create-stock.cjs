'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categorieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fournisseurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Fournisseurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      DepotId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Depots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      isExhausted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Stocks');
  }
};