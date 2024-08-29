import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Lot = sequelize.define('Lot', {
    Name_Lot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LS_NoSerie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LS_Qte: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LS_LotEpuise: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    DL_NoIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DL_NoOut: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LS_MvtStock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Lots'
  });

  Lot.associate = (models) => {
    Lot.hasMany(models.Stock, { foreignKey: 'lotId', as: 'stocks' });
    Lot.belongsTo(models.Depot, {
      foreignKey: 'DE_No',
      as: 'depot',
      onDelete: 'CASCADE',
    });
  };

  Lot.prototype.checkAndUpdateExhaustedStatus = async function() {
    const stocks = await this.getStocks({
      include: [{ model: sequelize.models.Product, as: 'products' }]
    });
    
    let totalProductQuantity = stocks.reduce((sum, stock) => 
      sum + stock.products.reduce((stockSum, product) => stockSum + product.QuantiteProduct, 0), 0);
    
    this.LS_LotEpuise = totalProductQuantity > this.LS_Qte;
    await this.save();
  };

  return Lot;
};