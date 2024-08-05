import { Sequelize } from 'sequelize';
import config from '../config/db.config.js';

import User from './User.js';
import Product from './Articles.js';
import Lot from './Lot.js';
import Stock from './Stock.js';
import CommandeClient from './CommandeClient.js';
import Facture from './Facture.js';
import Depot from './Depot.js';
import SuiviStock from './SuiviStock.js';
import Role from './Role.js';
import Fournisseur from './Fournisseur.js';
import Category from './Categorie.js';  // Make sure you have this import
import CommandeProducts from './CommandeProducts.js';
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  logging: console.log,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models
db.User = User(sequelize);
db.Product = Product(sequelize);
db.Lot = Lot(sequelize);
db.Stock = Stock(sequelize);
db.CommandeClient = CommandeClient(sequelize);
db.Facture = Facture(sequelize);
db.Depot = Depot(sequelize);
db.SuiviStock = SuiviStock(sequelize);
db.Role = Role(sequelize);
db.Fournisseur = Fournisseur(sequelize);
db.Category = Category(sequelize); // Ensure this line is correct


// Define the models
db.CommandeClient = CommandeClient(sequelize);
db.CommandeProducts = CommandeProducts(sequelize);
// Call associate if it exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;