
import db from '../models/index.js';
import multer from 'multer';
import path from 'path';

const { Product, Stock, Lot } = db;

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('imageUrl');
// const createProduct = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     const {
//       AR_Ref, AR_Design, FA_CodeFamille, AR_SuiviStock, PrixProduct,
//       categorieId, fournisseurId, UserId, stockId ,QuantiteProduct,QuantiteProductAvalible// Change to stockId
//     } = req.body;

//     const imageUrl = req.file ? req.file.path : null;

//     try {
//       // Create the product
//       const product = await Product.create({
//         AR_Ref,
//         AR_Design,
//         FA_CodeFamille,
//         AR_SuiviStock,
//         PrixProduct,
//         categorieId,
//         fournisseurId,
//         UserId,
//         imageUrl,
//         stockId,
//         QuantiteProduct,QuantiteProductAvalible
//       });

//       // Update stock quantity if AR_SuiviStock is true
//       if (AR_SuiviStock && stockId) {
//         const stock = await Stock.findByPk(stockId);
//         if (stock) {
//           await stock.update({ productQuantity: stock.productQuantity + 1 });
//         } else {
//           await Stock.create({ id: stockId, productQuantity: 1 });
//         }
//       }

//       res.status(201).json(product);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// };
// const createProduct = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     const { AR_Ref, AR_Design, FA_CodeFamille, AR_SuiviStock, PrixProduct, categorieId, fournisseurId, UserId } = req.body;
//     const imageUrl = req.file ? req.file.path : null;

//     try {
//       const product = await Product.create({
//         AR_Ref, 
//         AR_Design, 
//         FA_CodeFamille, 
//         AR_SuiviStock, 
//         PrixProduct,
//         categorieId, 
//         fournisseurId, 
//         UserId, 
//         imageUrl
//       });
//       res.status(201).json(product);
//       console.log('Received product data:', req.body);

//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// };
const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const {
      AR_Ref, AR_Design, FA_CodeFamille, AR_SuiviStock, PrixProduct,
      categorieId, fournisseurId, UserId, stockId, QuantiteProduct, QuantiteProductAvalible
    } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    try {
      // Start a transaction
      const result = await db.sequelize.transaction(async (t) => {
        // Create the product
        const product = await Product.create({
          AR_Ref,
          AR_Design,
          FA_CodeFamille,
          AR_SuiviStock,
          PrixProduct,
          categorieId,
          fournisseurId,
          UserId,
          imageUrl,
          stockId,
          QuantiteProduct,
          QuantiteProductAvalible
        }, { transaction: t });

        // Update stock quantity
        const stock = await Stock.findByPk(stockId, { transaction: t });
        if (!stock) {
          throw new Error('Stock not found');
        }

        const newStockQuantity = stock.productQuantity + parseInt(QuantiteProduct);
        await stock.update({ productQuantity: newStockQuantity }, { transaction: t });

        // Check lot limit
        const lot = await Lot.findByPk(stock.lotId, { transaction: t });
        if (!lot) {
          throw new Error('Lot not found');
        }

        if (newStockQuantity > lot.LS_Qte) {
          // If lot limit is exceeded, we still create the product but return a warning
          return { product, warning: 'Lot limit exceeded' };
        }

        return { product };
      });

      if (result.warning) {
        res.status(201).json({ 
          product: result.product, 
          message: 'Product added successfully but lot limit exceeded',
          warning: result.warning 
        });
      } else {
        res.status(201).json({ product: result.product, message: 'Product added successfully' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { id } = req.params;
    const { AR_Ref, AR_Design, FA_CodeFamille, AR_SuiviStock,PrixProduct, categorieId, fournisseurId,QuantiteProduct, UserId } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
      // Find the product by id
      const [updated] = await Product.update({
        AR_Ref, 
        AR_Design, 
        FA_CodeFamille, 
        AR_SuiviStock, 
        categorieId,
         PrixProduct,
        fournisseurId, 
        UserId, 
        QuantiteProduct,
        imageUrl
      }, {
        where: { id }
      });

      if (updated) {
        const updatedProduct = await Product.findOne({ where: { id } });
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductsByStock = async (req, res) => {
  try {
    const { id: stockId } = req.params;
    const products = await Product.findAll({ where: { stockId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById, upload ,getProductsByStock };
