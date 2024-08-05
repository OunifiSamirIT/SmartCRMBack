import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SuiviStock = sequelize.define('SuiviStock', {
      mouvement: {
        type: DataTypes.STRING,
        allowNull: false, // IN or OUT
      },
      quantite: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stockId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'stocks',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  
    SuiviStock.associate = (models) => {
      SuiviStock.belongsTo(models.Stock, { foreignKey: 'stockId', as: 'stock' });
    };
  
    return SuiviStock;
  };
  