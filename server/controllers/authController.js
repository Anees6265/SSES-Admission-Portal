const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password, role, track } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password, role, track });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, track: user.track,
    token: generateToken(user._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  if (!user.isActive)
    return res.status(403).json({ message: 'Account is deactivated' });
  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, track: user.track,
    token: generateToken(user._id),
  });
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
