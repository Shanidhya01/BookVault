import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });
  res.json(req.user);
};

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
