// controller/roleController.js
import db from '../models/index.js';
const { Role } = db;
const addRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add other controller methods as needed

export default { addRole, getAllRoles };
