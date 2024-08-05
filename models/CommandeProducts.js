// models/CommandeProducts.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const CommandeProducts = sequelize.define('CommandeProducts', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalcommandeproduct: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'CommandeProducts'
    });

    return CommandeProducts;
};
