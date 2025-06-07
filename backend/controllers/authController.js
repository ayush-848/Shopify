const User = require('../model/user');
const Role = require('../model/role'); // Import Role model (though not directly used in this snippet for role assignment logic)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Define the secret admin key
const ADMIN_SECRET_KEY = '77689'; // This should ideally be in process.env for production

const checkFormat = (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 5) { // Changed to 5 to match frontend validation if needed, but schema is 6
    throw new Error("Password must be at least 6 characters long"); // Keep consistent with schema
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, role, adminKey } = req.body; // Destructure role and adminKey

    checkFormat(username, email, password);

    const isUser = await User.findOne({ email });
    const sameUsername = await User.findOne({ username });
    if (isUser || sameUsername) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let roleId;
    if (role === 'admin') {
      // If role is admin, check the provided adminKey
      if (adminKey !== ADMIN_SECRET_KEY) {
        return res.status(401).json({ // Use 401 for unauthorized access
          success: false,
          error: true,
          message: "Invalid Admin Key. Please provide the correct key to register as an Admin.",
        });
      }
      roleId = 2; // Assuming roleId 2 is for Admin
    } else {
      roleId = 1; // Default roleId 1 for User
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      roleId, // Use the determined roleId
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    let errorMessage = "Server error, please try again later";
    if (error.message.includes("All fields are required")) {
      errorMessage = "All fields are required";
    } else if (error.message.includes("Invalid email format")) {
      errorMessage = "Invalid email format";
    } else if (error.message.includes("Password must be at least")) {
      errorMessage = "Password must be at least 6 characters";
    }

    return res.status(500).json({
      success: false,
      error: true,
      message: errorMessage,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const errorMsg = "Incorrect email or password";

    if (!user) {
      return res.status(403).json({
        success: false,
        message: errorMsg,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        success: false,
        message: errorMsg,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        username: user.username,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwtToken", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { signup, login, logout };