// controllers/commandeClientController.js
import db from '../models/index.js';
const { CommandeClient, CommandeProducts, Product, Stock, Facture } = db;

const createCommandeClient = async (req, res) => {
  try {
    const { clientName, address, billingDate, deliveryDate, products } = req.body;

    // Create CommandeClient
    const commandeClient = await CommandeClient.create({
      clientName,
      address,
      billingDate,
      deliveryDate,
    });

    // Create associations with products
    const commandeProducts = products.map(product => ({
      commandeClientId: commandeClient.id,
      productId: product.productId,
      quantity: product.quantity,
    }));

    await CommandeProducts.bulkCreate(commandeProducts);

    // Update product quantities and calculate total amount
    let totalAmount = 0;
    for (const product of products) {
      const { productId, quantity, price } = product;
      const productRecord = await Product.findByPk(productId);

      if (productRecord) {
        await productRecord.update({
          QuantiteProductAvalible: productRecord.QuantiteProductAvalible - quantity,
        });
      }

      totalAmount += quantity * price;
    }

    // Generate facture number
    const factureCount = await Facture.count();
    const factureNumber = `FACT-${String(factureCount + 1).padStart(4, '0')}`;

    // Create Facture
    const facture = await Facture.create({
      numero: factureNumber,
      totalAmount,
      typeFacture: 'commande client',
      commandeClientId: commandeClient.id,
    });

    res.status(201).json({ commandeClient, facture });
  } catch (error) {
    console.error('Error creating commandeClient:', error);
    res.status(500).json({ message: error.message });
  }
};

// const createCommandeClient = async (req, res) => {
//   try {
//     const { clientName, address, billingDate, deliveryDate, products } = req.body;

//     // Create CommandeClient
//     const commandeClient = await CommandeClient.create({
//       clientName,
//       address,
//       billingDate,
//       deliveryDate,
//     });

//     // Create associations with products
//     const commandeProducts = products.map(product => ({
//       commandeClientId: commandeClient.id,
//       productId: product.productId,
//       quantity: product.quantity,
//     }));

//     await CommandeProducts.bulkCreate(commandeProducts);

//     // Update stock quantities
//     for (const product of products) {
//       const { productId, quantity } = product;
//       const productRecord = await Product.findByPk(productId);

//       if (productRecord && productRecord.stockId) {
//         const stock = await Stock.findByPk(productRecord.stockId);
//         if (stock) {
//           await stock.update({ productQuantity: stock.productQuantity - quantity });
//         }
//       }
//     }

//     res.status(201).json(commandeClient);
//   } catch (error) {
//     console.error('Error creating commandeClient:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

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
