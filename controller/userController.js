import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const { User, Role } = db;


// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user has a valid role
    const roles = ['admin', 'superadmin', 'agent']; // Define the valid roles
    const userRole = user.role;
    if (!roles.includes(userRole)) {
      return res.status(401).json({ message: `Unauthorized: Role '${userRole}' is not permitted` });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Ensure to set this in your environment variables
      { expiresIn: '1h' } // Token expiry
    );

    // Return user information
    const userInfo = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    res.status(200).json({ token, user: userInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createUser = async (req, res) => {
  const { email, password, role ,roleId } = req.body;
  const { file } = req;

  console.log('Request User:', req.user); // Debugging line

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminUser = await User.findOne({ where: { id: req.user.id, roleId : 1 } });
    if (!adminUser) {
      return res.status(403).json({ message: 'Only admin users can create new users' });
    }

    const hashedPassword = await bcrypt.hash(password, 6);
    const profileImage = file ? file.path : null;
    const user = await User.create({ email, password: hashedPassword, role , profileImage ,roleId });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};






const blockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.blocked = !user.blocked; // Toggle the blocked status
    await user.save();

    res.status(200).json({ message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params; // ID is extracted from params to identify the user
  const { email, password, role, adresse, age, numtelf } = req.body; // Other fields are extracted from the body

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare data for updating, excluding the ID
    const updateData = {
      email: email || user.email,
      role: role || user.role,
      adresse: adresse || user.adresse,
      age: age || user.age,
      numtelf: numtelf || user.numtelf,
    };

    // If a new password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // If a new profile image is uploaded, add its path
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // Update the user with the new data
    await user.update(updateData);

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { login, createUser,getMe, getAllUsers,blockUser, getUserById, updateUser, deleteUser };
