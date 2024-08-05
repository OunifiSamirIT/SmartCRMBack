// models/User.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };
  return User;
};