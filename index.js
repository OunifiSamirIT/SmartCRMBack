// index.js
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './models/index.js';
import SequelizeStore from 'connect-session-sequelize';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import lotRoutes from './routes/lotRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import depotRoutes from './routes/depotRoutes.js';
import commandeClientRoutes from './routes/commandeClientRoutes.js';
import factureRoutes from './routes/factureRoutes.js';
import suiviStockRoutes from './routes/suiviStockRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import fournisseurRoutes from './routes/fournisseurRoutes.js';
import categorieRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
const SequelizeStoreInstance = SequelizeStore(session.Store);

const store = new SequelizeStoreInstance({
  db: db.sequelize,
});

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000', // Adjust as necessary
}));
app.use(express.json());

// Define routes
app.use('/authh', authRoutes);
app.use('/auth', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categorieRoutes);
app.use('/lots', lotRoutes);
app.use('/stocks', stockRoutes);
app.use('/depots', depotRoutes);
app.use('/commandeClients', commandeClientRoutes);
app.use('/factures', factureRoutes);
app.use('/suiviStocks', suiviStockRoutes);
app.use('/roles', roleRoutes);
app.use('/fournisseurs', fournisseurRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sync database
db.sequelize.sync().then(() => {
    console.log('Database & tables created!');
  }).catch((error) => {
    console.error('Error syncing database:', error);
  });

// Start server
app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running...');
});
