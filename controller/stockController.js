// controllers/stockController.js
import db from '../models/index.js';
const { Product, Stock } = db;

const addStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductsByStock = async (req, res) => {
  try {
    const { id: stockId } = req.params;
    const products = await Product.findAll({
      where: { stockId },
      include: [
        {
          model: Stock,
          attributes: ['productQuantity'],
        },
      ],
    });
    const productsWithQuantity = products.map(product => ({
      ...product.toJSON(),
      quantityInStock: product.Stock.productQuantity,
    }));
    res.status(200).json(productsWithQuantity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      include: [
        {
          model: Product,
          as: 'products',
        },
      ],
    });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStock = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (stock) {
      res.status(200).json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const [updated] = await Stock.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedStock = await Stock.findByPk(req.params.id);
      res.status(200).json(updatedStock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStock = async (req, res) => {
  try {
    const deleted = await Stock.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { 
  addStock, 
  getAllStocks, 
  getStock, 
  updateStock, 
  deleteStock ,
  getProductsByStock  
};