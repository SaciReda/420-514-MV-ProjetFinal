import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const user = await User.create({ email, password, name });
    const token = generateToken({ id: user._id });

    res.status(201).json({
      status: "success",
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  const token = generateToken({ id: user._id });

  res.json({
    status: "success",
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
};
