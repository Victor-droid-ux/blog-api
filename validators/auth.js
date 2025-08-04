const { check } = require("express-validator");
const validateEmail = require("./validateEmail");
const mongoose = require("mongoose");

const signupValidator = [
  check("username").notEmpty().withMessage("Username is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be six character long")
    .notEmpty()
    .withMessage("Password is required"),
];

const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password").notEmpty().withMessage("Password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email is required"),
];

const verifyUserValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("verificationCode")
    .notEmpty()
    .withMessage("Verification code is required"),
];

const resetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid Email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password should be six character long")
    .notEmpty()
    .withMessage("New password is required"),

  check("forgotPasswordCode")
    .notEmpty()
    .withMessage("Forgot password code is required"),
];

const changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password should be six character long")
    .notEmpty()
    .withMessage("New password is required"),
];

const updateProfileValidator = [
  check("email").custom(async (email) => {
    if (email) {
      const isValid = validateEmail(email);
      if (!isValid) {
        throw new Error("Invalid Email format");
      }
    }
  }),

  check("profileImage").custom(async (profileImage) => {
    if (profileImage && !mongoose.Types.ObjectId.isValid(profileImage)) {
      throw new Error("Invalid image format");
    }
  }),
];

module.exports = {
  signupValidator,
  loginValidator,
  emailValidator,
  verifyUserValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
