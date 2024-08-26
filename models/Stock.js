import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Stock = sequelize.define('Stock', {
    stockName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fournisseurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DepotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isExhausted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  Stock.associate = (models) => {
    Stock.belongsTo(models.Lot, { foreignKey: 'lotId', as: 'lot' });
    Stock.hasMany(models.Product, { foreignKey: 'stockId', as: 'products' });
    Stock.belongsTo(models.Category, { foreignKey: 'categorieId', as: 'category' });
    Stock.belongsTo(models.Fournisseur, { foreignKey: 'fournisseurId', as: 'fournisseur' });
    Stock.belongsTo(models.Depot, { foreignKey: 'DepotId', as: 'depot' });
  };

  Stock.prototype.calculateTotalQuantity = async function() {
    const products = await this.getProducts();
    return products.reduce((sum, product) => sum + product.QuantiteProduct, 0);
};

Stock.prototype.updateLotStatus = async function() {
    const lot = await this.getLot();
    if (lot) {
        const totalQuantity = await this.calculateTotalQuantity();
        const isExhausted = totalQuantity > lot.LS_Qte;
        if (lot.LS_LotEpuise !== isExhausted) {
            lot.LS_LotEpuise = isExhausted;
            await lot.save();
        }
    }
};
Stock.beforeSave(async (stock) => {
  const lot = await stock.getLot();
  if (lot) {
    stock.isExhausted = lot.LS_LotEpuise;
  }
});

  return Stock;
};