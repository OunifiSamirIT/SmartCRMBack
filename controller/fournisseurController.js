// controllers/fournisseurController.js
import db from '../models/index.js';
const { Fournisseur } = db;

const addFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    res.status(201).json(fournisseur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.findAll();
    res.status(200).json(fournisseurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFournisseurById = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findByPk(req.params.id);
    if (fournisseur) {
      res.status(200).json(fournisseur);
    } else {
      res.status(404).json({ message: 'Fournisseur not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFournisseur = async (req, res) => {
  try {
    const [updated] = await Fournisseur.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedFournisseur = await Fournisseur.findByPk(req.params.id);
      res.status(200).json(updatedFournisseur);
    } else {
      res.status(404).json({ message: 'Fournisseur not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFournisseur = async (req, res) => {
  try {
    const deleted = await Fournisseur.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Fournisseur not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { 
  addFournisseur, 
  getAllFournisseurs, 
  getFournisseurById, 
  updateFournisseur, 
  deleteFournisseur 
};