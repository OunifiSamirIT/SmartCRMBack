

  import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Depot = sequelize.define('Depot', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },  }, {
    tableName: 'depots'
  });

  Depot.associate = (models) => {
    Depot.hasMany(models.Lot, {
      foreignKey: 'DE_No',
      as: 'lots',
    });
  };

  return Depot;
};