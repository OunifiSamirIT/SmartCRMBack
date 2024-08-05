import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'categories',
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: 'categorieId' });
  };

  return Category;
};
