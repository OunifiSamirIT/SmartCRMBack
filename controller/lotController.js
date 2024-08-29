import db from '../models/index.js';

const { Lot, Stock, Product } = db;

const addLot = async (req, res) => {
  try {
    const lot = await Lot.create(req.body);
    res.status(201).json(lot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLotStatus = async (lotId) => {
  const lot = await Lot.findByPk(lotId, {
    include: [{ model: Stock, as: 'stocks' }]
  });
  
  if (lot) {
    await lot.checkAndUpdateExhaustedStatus();
  }
};

const getAllLots = async (req, res) => {
  try {
    const lots = await Lot.findAll({
      include: [{ model: Stock, as: 'stocks' }]
    });

    // Update status for each lot
    await Promise.all(lots.map(lot => updateLotStatus(lot.id)));

    // Fetch updated lots
    const updatedLots = await Lot.findAll({
      include: [{ model: Stock, as: 'stocks' }]
    });

    res.status(200).json(updatedLots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getLot = async (req, res) => {
  try {
    const lot = await Lot.findByPk(req.params.id);
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    res.status(200).json(lot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLot = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const lot = await Lot.findByPk(id);
    if (!lot) {
      return res.status(404).json({ message: 'Lot not found' });
    }

    // Update the lot
    await lot.update(updatedData);

    // Check and update the exhausted status
    await lot.checkAndUpdateExhaustedStatus();

    // Fetch the updated lot with its stocks and products
    const updatedLot = await Lot.findByPk(id, {
      include: [{
        model: Stock,
        as: 'stocks',
        include: [{ model: Product, as: 'products' }]
      }]
    });

    res.status(200).json(updatedLot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLot = async (req, res) => {
  try {
    const deleted = await Lot.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { addLot, getAllLots, getLot, updateLot, deleteLot };
