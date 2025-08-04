const express = require('express');
const router = express.Router();

const { authController } = require("../controllers");
const {
  signupValidator,
  loginValidator,
  emailValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
  verifyUserValidator,
} = require("../validators/auth");

const validate = require("../validators/validate");
const isAuth = require("../middlewares/isAuth");

// Auth Routes
router.post("/signup", signupValidator, validate, authController.signup);

router.post("/login", loginValidator, validate, authController.login);

router.post("/send-verification-code", emailValidator, validate, authController.sendVerificationCode);

router.post("/verify-user", verifyUserValidator, validate, authController.verifyUser);

router.post("/forgot-password-code", emailValidator, validate, authController.forgotPasswordCode);

router.post("/reset-password", resetPasswordValidator, validate, authController.resetPassword);

// Authenticated Routes
router.put("/change-password", changePasswordValidator, validate, isAuth, authController.changePassword);
router.put("/update-profile", updateProfileValidator, validate, isAuth, authController.updateProfile);
router.get("/current-user", isAuth, authController.currentUser);

module.exports = router;
