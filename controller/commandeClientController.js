import db from '../models/index.js';
const { CommandeClient, CommandeProducts, Product, Stock, Facture } = db;

const createCommandeClient = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { clientName, address, billingDate, deliveryDate, products } = req.body;

    // Create CommandeClient
    const commandeClient = await CommandeClient.create({
      clientName,
      address,
      billingDate,
      deliveryDate,
    }, { transaction: t });

    // Create associations with products and update stock
    const commandeProducts = [];
    let totalAmount = 0;

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
      });

      totalAmount += quantity * price;
    }

    await CommandeProducts.bulkCreate(commandeProducts, { transaction: t });

    // Generate facture number
    const factureCount = await Facture.count({ transaction: t });
    const factureNumber = `FACT-${String(factureCount + 1).padStart(4, '0')}`;

    // Create Facture
    const facture = await Facture.create({
      numero: factureNumber,
      totalAmount,
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

export default { createCommandeClient, getAllCommandeClients };