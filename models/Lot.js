import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Lot = sequelize.define('Lot', {
    Name_Lot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LS_NoSerie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LS_Qte: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LS_LotEpuise: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    DL_NoIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DL_NoOut: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LS_MvtStock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Lots'
  });

  Lot.associate = (models) => {
    Lot.belongsTo(models.Depot, {
      foreignKey: 'DE_No',
      as: 'depot',
      onDelete: 'CASCADE',
    });
  };

  return Lot;
};