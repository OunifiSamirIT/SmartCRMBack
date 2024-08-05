// models/Stock.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Stock = sequelize.define('Stock', {
    stockName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fournisseurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    DepotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  
  Stock.associate = (models) => {
    Stock.hasMany(models.Product, { foreignKey: 'stockId', as: 'products' });
  };
  return Stock;
};
