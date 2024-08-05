import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { User } = db;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user has an admin role
    const roles = [user.role]; // Create an array with the user's role
    const isAdmin = roles.includes('admin');

    if (!isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Ensure to set this in your environment variables
      { expiresIn: '1h' } // Token expiry
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { login };
