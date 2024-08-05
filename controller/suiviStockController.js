// controller/suiviStockController.js
import db from '../models/index.js';
const { SuiviStock } = db;
const addSuiviStock = async (req, res) => {
  try {
    const suiviStock = await SuiviStock.create(req.body);
    res.status(201).json(suiviStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSuiviStocks = async (req, res) => {
  try {
    const suiviStocks = await SuiviStock.findAll();
    res.status(200).json(suiviStocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add other controller methods as needed

export default { addSuiviStock, getAllSuiviStocks };
