// import { DataTypes } from 'sequelize';

// export default (sequelize) => {
//   const Fournisseur = sequelize.define('fournisseur', {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     contactInfo: {
//       type: DataTypes.STRING,
//     },
//     address: {
//       type: DataTypes.STRING,
//     },
//   });

//   // Fournisseur.associate = (models) => {
//   //   Fournisseur.hasMany(models.Product, {
//   //     foreignKey: 'fournisseurId',
//   //     as: 'products',
//   //   });
//   // };

//   return Fournisseur;
// };



import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Fournisseur = sequelize.define('Fournisseur', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },  }, {
    tableName: 'fournisseurs'
  });

  Fournisseur.associate = (models) => {
    Fournisseur.hasMany(models.Product, { foreignKey: 'fournisseurId' });
  };

  return Fournisseur;
};