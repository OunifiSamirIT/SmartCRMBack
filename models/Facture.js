import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Facture = sequelize.define('Facture', {
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    typeFacture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pdfFile: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
  });

  Facture.associate = (models) => {
    Facture.belongsTo(models.CommandeClient, { foreignKey: 'commandeClientId', as: 'commandeClient' });
  };

  return Facture;
};