// controllers/stockController.js
import db from '../models/index.js';
const { Stock, Product, Lot } = db;

const checkAndUpdateExhaustedStatus = async (stockId) => {
  const stock = await Stock.findByPk(stockId, {
    include: [{ model: Product, as: 'products' }, { model: Lot, as: 'lot' }]
  });

  if (stock) {
    await stock.checkAndUpdateExhaustedStatus();
  }
};

const addProductToStock = async (req, res) => {
  try {
    const { stockId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!stock || !product) {
      return res.status(404).json({ message: 'Stock or Product not found' });
    }

    product.stockId = stockId;
    product.QuantityInStock = (product.QuantityInStock || 0) + quantity;
    await product.save();
    const stock = await Stock.findByPk(stockId, { include: ['lot'] });
    if (stock && stock.lot) {
      await updateLotStatus(stock.lot.id);
    }

    res.status(200).json({ message: 'Product added to stock successfully' });
    await stock.checkAndUpdateExhaustedStatus();

    res.status(200).json({ message: 'Product added to stock successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeProductFromStock = async (req, res) => {
  try {
    const { stockId, productId, quantity } = req.body;
    const product = await Product.findByPk(productId);

    if (!stock || !product) {
      return res.status(404).json({ message: 'Stock or Product not found' });
    }

    if (product.QuantityInStock < quantity) {
      return res.status(400).json({ message: 'Not enough quantity in stock' });
    }

    product.QuantityInStock -= quantity;
    if (product.QuantityInStock === 0) {
      product.stockId = null;
    }
    await product.save();
    const stock = await Stock.findByPk(stockId, { include: ['lot'] });
    if (stock && stock.lot) {
      await updateLotStatus(stock.lot.id);
    }

    res.status(200).json({ message: 'Product added to stock successfully' });
    await stock.checkAndUpdateExhaustedStatus();

    res.status(200).json({ message: 'Product removed from stock successfully' });
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
  addProductToStock, 
  getAllStocks, 
  getStock, 
  updateStock, 
  deleteStock ,
  removeProductFromStock,
  getProductsByStock  
};