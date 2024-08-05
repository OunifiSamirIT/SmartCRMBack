import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserRoles = sequelize.define('userRoles', {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  
    return UserRoles;
  };
  