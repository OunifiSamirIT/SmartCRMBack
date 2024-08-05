// controllers/factureController.js
import db from '../models/index.js';
const { Facture } = db;




 const savePDF = async (req, res) => {
  try {
    const { factureId } = req.params;
    const pdfFile = req.file.buffer;

    const facture = await Facture.findByPk(factureId);
    if (!facture) {
      return res.status(404).json({ message: 'Facture not found' });
    }

    await facture.update({ pdfFile });

    res.status(200).json({ message: 'PDF saved successfully' });
  } catch (error) {
    console.error('Error saving PDF:', error);
    res.status(500).json({ message: error.message });
  }
};
const createFacture = async (req, res) => {
  try {
    const facture = await Facture.create(req.body);
    res.status(201).json(facture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.findAll({
      attributes: ['id', 'numero', 'totalAmount', 'date', 'typeFacture', 'pdfFile'],
    });
    res.status(200).json(factures);
  } catch (error) {
    console.error('Error fetching factures:', error);
    res.status(500).json({ message: error.message });
  }
};

export default { createFacture, getAllFactures , savePDF };
