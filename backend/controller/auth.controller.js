import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const usernameRegex = /^(?!\s)[a-zA-Z0-9]*$/;
    const emailRegex = /([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const checkExistingUserByUsername = await User.findOne({
      username: username,
    });
    const checkExistingUserByEmail = await User.findOne({ email: email });
    if (checkExistingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    if (checkExistingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const PROFILE_IMGS = [
      "/images/profile/avatar1.png",
      "/images/profile/avatar2.jpg",
      "/images/profile/avatar3.png",
    ];
    const image = PROFILE_IMGS[Math.floor(Math.random() * PROFILE_IMGS.length)];
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      image: image,
    });
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in signup: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {}
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function authCheck(req, res) {
  try {
    console.log("req.user: ", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
