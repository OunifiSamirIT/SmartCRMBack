import db from '../models/index.js';
import multer from 'multer';
import stream from 'stream';
const { CommandeClient, CommandeProducts, Product, Stock, Facture } = db;
const upload = multer();

const createCommandeClient = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { clientName, address, billingDate, deliveryDate, products, totalcommandeproduct } = req.body;

    // Create CommandeClient
    const commandeClient = await CommandeClient.create({
      clientName,
      address,
      billingDate,
      deliveryDate,
      totalcommandeproduct
    }, { transaction: t });

    // Create associations with products and update stock
    const commandeProducts = [];
    let calculatedTotalAmount = 0;

    for (const product of products) {
      const { productId, quantity, price } = product;
      const productRecord = await Product.findByPk(productId, { transaction: t });

      if (!productRecord) {
        throw new Error(`Product with id ${productId} not found`);
      }

      // Check and update stock
      const stock = await Stock.findByPk(productRecord.stockId, { transaction: t });
      if (!stock) {
        throw new Error(`Stock not found for product ${productId}`);
      }

      if (stock.productQuantity < quantity) {
        throw new Error(`Insufficient stock for product ${productRecord.AR_Design}`);
      }

      await stock.update({
        productQuantity: stock.productQuantity - quantity
      }, { transaction: t });

      // Update product's QuantiteProductAvalible
      await productRecord.update({
        QuantiteProductAvalible: productRecord.QuantiteProductAvalible - quantity
      }, { transaction: t });

      commandeProducts.push({
        commandeClientId: commandeClient.id,
        productId: productId,
        quantity: quantity,
        price: price
      });

      calculatedTotalAmount += quantity * price;
    }

    await CommandeProducts.bulkCreate(commandeProducts, { transaction: t });

    // Generate facture number
    const factureCount = await Facture.count({ transaction: t });
    const factureNumber = `FACT-${String(factureCount + 1).padStart(4, '0')}`;

    // Create Facture
    const facture = await Facture.create({
      numero: factureNumber,
      totalAmount: calculatedTotalAmount,
      typeFacture: 'commande client',
      commandeClientId: commandeClient.id,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ commandeClient, facture });
  } catch (error) {
    await t.rollback();
    console.error('Error creating commandeClient:', error);
    res.status(500).json({ message: error.message });
  }
};



const getAllCommandeClients = async (req, res) => {
  try {
    const commandeClients = await CommandeClient.findAll({
      include: [{
        model: Product,
        as: 'products',
        through: {
          attributes: ['quantity'], // Include quantity in the response
        },
      }],
    });
    res.status(200).json(commandeClients);
  } catch (error) {
    console.error('Error fetching commandeClients:', error);
    res.status(500).json({ message: error.message });
  }
};


const savePDF = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { factureId } = req.body;
    const pdfBuffer = req.file.buffer;

    const facture = await Facture.findByPk(factureId, { transaction: t });

    if (!facture) {
      throw new Error(`Facture with id ${factureId} not found`);
    }

    await facture.update({
      pdfFile: pdfBuffer
    }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: 'PDF saved successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error saving PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPDF = async (req, res) => {
  try {
    const { factureId } = req.params;
    const facture = await Facture.findByPk(factureId);

    if (!facture || !facture.pdfFile) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const pdfStream = new stream.PassThrough();
    pdfStream.end(facture.pdfFile);

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `inline; filename=facture-${facture.numero}.pdf`);

    pdfStream.pipe(res);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

export default { createCommandeClient, getAllCommandeClients, savePDF, getPDF };
