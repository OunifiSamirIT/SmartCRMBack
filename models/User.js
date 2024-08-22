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
    adresse: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.STRING,
    },
    numtelf: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: { // New field
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: { // Add this field to your model
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blocked: { // New field to track if the user is blocked
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId' });
  };
  return User;
};