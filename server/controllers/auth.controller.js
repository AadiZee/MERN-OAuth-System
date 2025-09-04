import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import generateToken from "../utils/token.utils.js";
import passport from "passport";

export const signUpEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const user = await User.create({
      email,
      password,
      providers: [{ name: "local", id: email }],
    });

    const token = generateToken(user);
    return res.json({
      token,
      user: { id: user._id, email: user.email, providers: user.providers },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const signUpMobile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { mobile, password } = req.body;

    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const user = await User.create({
      mobile,
      password,
      providers: [{ name: "mobile", id: "mobile" }],
    });

    const token = generateToken(user);

    return res.json({
      token,
      user: { id: user._id, mobile: user.mobile, providers: user.providers },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginViaEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  passport.authenticate("local-email", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    let retUsr = user.toObject();
    delete retUsr.password;
    res.json({
      token,
      user: retUsr,
    });
  })(req, res, next);
};

export const loginViaMobile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  passport.authenticate("local-mobile", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    let retUsr = user.toObject();
    delete retUsr.password;
    res.json({
      token,
      user: retUsr,
    });
  })(req, res, next);
};

export const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
      avatar: req.user.avatar,
      providers: req.user.providers,
    },
  });
};

export const logout = async (req, res) => {
  return res.json({ message: "Logged Out!" });
};
