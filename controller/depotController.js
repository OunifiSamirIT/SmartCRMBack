import db from '../models/index.js';

const { Depot } = db;

const addDepot = async (req, res) => {
  try {
    const depot = await Depot.create(req.body);
    res.status(201).json(depot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDepots = async (req, res) => {
  try {
    const depots = await Depot.findAll();
    res.status(200).json(depots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepotById = async (req, res) => {
  try {
    const depot = await Depot.findByPk(req.params.id);
    if (!depot) {
      return res.status(404).json({ message: 'Depot not found' });
    }
    res.status(200).json(depot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepot = async (req, res) => {
  try {
    const depot = await Depot.findByPk(req.params.id);
    if (!depot) {
      return res.status(404).json({ message: 'Depot not found' });
    }
    await depot.update(req.body);
    res.status(200).json(depot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDepot = async (req, res) => {
  try {
    const depot = await Depot.findByPk(req.params.id);
    if (!depot) {
      return res.status(404).json({ message: 'Depot not found' });
    }
    await depot.destroy();
    res.status(204).json({ message: 'Depot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { addDepot, getAllDepots, getDepotById, updateDepot, deleteDepot };
