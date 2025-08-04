const User = require("../models/User");
const hashpassword = require("../utils/hashedpassword");
const comparePassword = require("../utils/comparepassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");
//const File = require("../models/User");
const handleMongoError = require("../helpers/mongoErrorHandler");
const { uploadMultipleFiles, signedUrl } = require("../utils/awsS3");
const File = require("../models/file");

const signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await hashpassword(password);
    if (!hashed) {
      throw new Error("Error hashing password");
    }

    const newUser = new User({ username, email, password: hashed, role });
    await newUser.save();

    res.status(201).json({
      status: true,
      message: "New user has been registered successfully",
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Wrong credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong credentials" });

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const sendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verificationCode) {
      return res
        .status(400)
        .json({ message: "Verification code already sent" });
    }

    const code = generateCode(6);
    user.verificationCode = code;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.status(200).json({
      status: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (verificationCode !== user.verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      status: true,
      message: "User verified successfully",
      token,
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.forgotPasswordCode) {
      return res.status(400).json({ message: "Code already sent" });
    }

    const code = generateCode(6);
    user.forgotPasswordCode = code;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Forgot Password Code",
      text: `Your forgot password code is: ${code}`,
    });

    res.status(200).json({
      status: true,
      message: "Code sent successfully",
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, forgotPasswordCode, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (forgotPasswordCode !== user.forgotPasswordCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const hashed = await hashpassword(newPassword);
    user.password = hashed;
    user.forgotPasswordCode = null;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    if (newPassword === currentPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    user.password = await hashpassword(newPassword);
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email, username, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent empty updates
    if (!email && !username && !profileImage && !req.file) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Email change resets verification
    if (email && email !== user.email) {
      user.email = email;
      user.isVerified = false;
    }

    if (username) user.username = username;

    // ✅ Handle image uploads via S3
    if (req.file) {
      const s3UploadResult = await uploadMultipleFiles({ files: [req.file] });
      const uploadedFile = s3UploadResult[0];

      const savedFile = await File.create({
        originalName: uploadedFile.originalName,
        filename: uploadedFile.filename,
        mimetype: uploadedFile.mimetype,
        contentType: uploadedFile.contentType,
        key: uploadedFile.key,
        url: uploadedFile.url,
        size: uploadedFile.size,
        createdBy: req.user._id,
      });

      user.profileImage = savedFile._id;
    } else if (profileImage) {
      user.profileImage = profileImage; // Already an ObjectId maybe
    }

    user.isVerified = true;
    await user.save();

    // ✅ Generate image URL from File
    let imageUrl = "";

    if (user.profileImage) {
      try {
        const imageFile = await File.findById(user.profileImage);

        if (imageFile?.url) {
          imageUrl = imageFile.url;
        } else if (imageFile?.key) {
          imageUrl = await signedUrl(imageFile.key);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
        imageUrl = "";
      }
    }

    return res.status(200).json({
      status: true,
      message: "Profile updated",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: imageUrl,
      },
    });
  } catch (error) {
    return handleMongoError(error, res);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id)
      .select("=password =verificationCode =forgotPasswordCode")
      .populate("profileImage")
      .populate({
        path: "categories",
        select: "title name description createdAt updatedAt",
      });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }

    // Fetch uploaded files by the user
    const uploadedFiles = await File.find({
      createdBy: _id,
      deleted: false,
    }).select("originalName filename url key size status createdAt");

    // Resolve profile image
    let imageUrl = "";
    if (user.profileImage) {
      imageUrl =
        user.profileImage.url || (await signedUrl(user.profileImage.key));
    }

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Current user fetched successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        password: user.password, // Don't return password in response
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileImage: imageUrl,
        categories: user.categories || [],
        files: uploadedFiles || [],
      },
    });
  } catch (error) {
    return handleMongoError(error, res);
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
  currentUser,
};
