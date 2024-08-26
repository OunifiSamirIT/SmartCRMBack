// // models/Product.js
// import { DataTypes } from 'sequelize';

// export default (sequelize) => {
//     const Product = sequelize.define('Product', {
//         AR_Ref: {
//             type: DataTypes.STRING,
//         },
//         AR_Design: {
//             type: DataTypes.STRING,
//         },
//         FA_CodeFamille: {
//             type: DataTypes.STRING,
//         },
//         PrixProduct: {
//             type: DataTypes.STRING,
//         },
//         QuantiteProduct: {
//             type: DataTypes.INTEGER,
//         },
//         QuantiteProductAvalible: {
//             type: DataTypes.INTEGER,
//         },
//         AR_SuiviStock: {
//             type: DataTypes.BOOLEAN,
//         },
//         categorieId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'categories', // Ensure this is the exact table name
//                 key: 'id',
//             },
//             allowNull: false,
//             onDelete: 'CASCADE',
//         },
//         fournisseurId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'fournisseurs', // Ensure this is the exact table name
//                 key: 'id',
//             },
//             allowNull: false,
//             onDelete: 'CASCADE',
//         },
//         UserId: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'Users', // Ensure this is the exact table name
//                 key: 'id',
//             },
//             allowNull: true,
//             onDelete: 'SET NULL',
//             onUpdate: 'CASCADE',
//         },
//         imageUrl: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         stockId: { // Changed to stockId
//             type: DataTypes.INTEGER,
//             references: { model: 'Stocks', key: 'id' }, // Ensure this matches your stock model
//             allowNull: true,
//           },
//     }, {
//         tableName: 'Products'
//     });
//     Product.associate = (models) => {
//         Product.belongsTo(models.User, { foreignKey: 'UserId' });
//         Product.belongsTo(models.Category, { foreignKey: 'categorieId' });
//         Product.belongsTo(models.Fournisseur, { foreignKey: 'fournisseurId' });
//         Product.belongsToMany(models.CommandeClient, {
//             through: 'CommandeProducts', // Join table for many-to-many relationship
//             as: 'commandeClients',
//             foreignKey: 'productId',
//             otherKey: 'commandeClientId'
//         });
//         Product.belongsTo(models.Stock, { foreignKey: 'stockId' }); 

//     };


//     return Product;
// };
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Product = sequelize.define('Product', {
        AR_Ref: {
            type: DataTypes.STRING,
        },
        AR_Design: {
            type: DataTypes.STRING,
        },
        FA_CodeFamille: {
            type: DataTypes.STRING,
        },
        PrixProduct: {
            type: DataTypes.STRING,
        },
        QuantiteProduct: {
            type: DataTypes.INTEGER,
        },
        QuantiteProductAvalible: {
            type: DataTypes.INTEGER,
        },
        AR_SuiviStock: {
            type: DataTypes.BOOLEAN,
        },
        categorieId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        fournisseurId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'fournisseurs',
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
            allowNull: true,
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stockId: {
            type: DataTypes.INTEGER,
            references: { model: 'Stocks', key: 'id' },
            allowNull: true,
        },
    }, {
        tableName: 'Products',
        hooks: {
            afterSave: async (product, options) => {
                if (product.changed('QuantiteProduct') || product.changed('QuantiteProductAvalible')) {
                    const stock = await product.getStock();
                    if (stock) {
                        await stock.updateLotStatus();
                    }
                }
            }
        }
    });

    Product.associate = (models) => {
        Product.belongsTo(models.User, { foreignKey: 'UserId' });
        Product.belongsTo(models.Category, { foreignKey: 'categorieId' });
        Product.belongsTo(models.Fournisseur, { foreignKey: 'fournisseurId' });
        Product.belongsToMany(models.CommandeClient, {
            through: 'CommandeProducts',
            as: 'commandeClients',
            foreignKey: 'productId',
            otherKey: 'commandeClientId'
        });
        Product.belongsTo(models.Stock, { foreignKey: 'stockId' });
    };

    return Product;
};