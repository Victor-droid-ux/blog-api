const User = require("../models/User");
const hashpassword = require("../utils/hashedpassword");
const comparePassword = require("../utils/comparepassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("Email already exist");
    }

    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const hashed = await hashpassword(password, hashpassword);
    if (!hashed) {
      const error = new Error("Error hashing password");
      error.statusCode = 500;
      throw error; // Will be caught by your global error handler
    }

    const newUser = new User({
      username,
      email,
      password: hashed,
      role,
    });

    await newUser.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "New user has been registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Wrong credentials");
    }

    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      res.code = 401;
      throw new Error("Wrong credentials");
    }

    // Generate and return a JWT token
    const token = user.generateAuthToken(user);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    // Check if the user already has a verification code
    if (user.verificationCode) {
      res.code = 400;
      throw new Error("Verification code already sent");
    }

    // Use your generateCode() utility (already imported)
    const verificationCode = generateCode(6);
    if (!verificationCode) {
      res.code = 500;
      throw new Error("Error generating verification code");
    }

    // Save the verification code to the user document
    user.verificationCode = verificationCode;
    await user.save();

    // Send email
    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    // Normally send code by email here (not implemented)
    res.status(200).json({
      code: 200,
      status: true,
      message: "Verification code sent successfully",
      // ⚠️ Remove in production
    });
  } catch (error) {
    next(error);
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    // Check if the verification code matches
    console.log(
      "Expected code:",
      user.verificationCode,
      "Received code:",
      verificationCode
    );
    if (verificationCode !== user.verificationCode) {
      throw new Error("Invalid verification code");
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();

    // Generate a JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      code: 200,
      status: true,
      message: "User verified successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    // Check if the user already has a forgot password code
    if (user.forgotPasswordCode) {
      res.code = 400;
      throw new Error("Forgot password code already sent");
    }

    // Use your generateCode() utility (already imported)
    const forgotPasswordCode = generateCode(6);
    if (!forgotPasswordCode) {
      res.code = 500;
      throw new Error("Error generating forgot password code");
    }

    // Save the forgot password code to the user document
    user.forgotPasswordCode = forgotPasswordCode;
    await user.save();

    // Send email
    await sendEmail({
      to: email,
      subject: "Your Forgot Password Code",
      text: `Your forgot password code is: ${forgotPasswordCode}`,
    });

    // Normally send code by email here (not implemented)
    res.status(200).json({
      code: 200,
      status: true,
      message: "Forgot password code sent successfully",
      // ⚠️ Remove in production
    });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { email, forgotPasswordCode, newPassword } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    // Check if the forgot password code matches
    if (forgotPasswordCode !== user.forgotPasswordCode) {
      throw new Error("Invalid forgot password code");
    }

    // Hash the new password
    const hashedNewPassword = await hashpassword(newPassword);
    if (!hashedNewPassword) {
      res.code = 500;
      throw new Error("Error hashing new password");
    }

    // Update the user's password and clear the forgot password code
    user.password = hashedNewPassword;
    user.forgotPasswordCode = null; // Clear the forgot password code
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; // Assuming you have user ID in req.user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.code = 404;
      throw new Error("User with this ID not found");
    }

    // Check if the old password matches
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      res.code = 401;
      throw new Error("Provided password does not match the current password.");
    }

    // Validate new password
    if (!newPassword || newPassword.trim() === "") {
      res.code = 400;
      throw new Error("New password is required");
    }

    if (newPassword.length < 6) {
      res.code = 400;
      throw new Error("New password should be at least six characters long");
    }

    if (newPassword === currentPassword) {
      res.code = 400;
      throw new Error("New password cannot be the same as the old password");
    }

    // Hash the new password
    const hashedNewPassword = await hashpassword(newPassword);
    if (!hashedNewPassword) {
      res.code = 500;
      throw new Error("Error hashing new password");
    }

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: " Your password has been changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email, username } = req.body;
    const userId = req.user._id; // Assuming you have user ID in req.user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.code = 404;
      throw new Error("User with this ID not found");
    }

    // Update the user's profile
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }

    if (email) {
      user.isEmailVerified = false; // Reset email verification status if email is updated
    }

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  sendVerificationCode,
  verifyUser,
  forgotPasswordCode,
  resetPassword,
  changePassword,
  updateProfile,
};
