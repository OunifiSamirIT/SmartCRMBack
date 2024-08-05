// models/CommandeClient.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const CommandeClient = sequelize.define('CommandeClient', {
        clientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        billingDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'CommandeClients'
    });

    CommandeClient.associate = (models) => {
        CommandeClient.belongsToMany(models.Product, {
            through: 'CommandeProducts', // Join table for many-to-many relationship
            as: 'products',
            foreignKey: 'commandeClientId',
            otherKey: 'productId'
        });
    };

    return CommandeClient;
};
