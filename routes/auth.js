const express = require('express');
const router = express.Router();
const { authController } = require ("../controllers");
const { 
    signupValidator, 
    loginValidator, 
    emailValidator, 
    resetPasswordValidator, 
    changePasswordValidator, 
    updateProfileValidator 
} = require ("../validators/auth")

const validate  = require ("../validators/validate")
const { verifyUserValidator } = require("../validators/auth");
const isAuth = require("../middlewares/isAuth");

router.post("/signup", signupValidator, validate, authController.signup);

router.post("/login", loginValidator, validate, authController.login);
router.post("/send-verification-code", emailValidator, validate, authController.sendVerificationCode);
router.post("/verify-user", verifyUserValidator, validate, authController.verifyUser);
router.post("/forgot-password-code", emailValidator, validate, authController.forgotPasswordCode);
router.post("/reset-password", resetPasswordValidator, validate, authController.resetPassword);
router.put("/change-password", changePasswordValidator, validate, isAuth, authController.changePassword);
router.put("/update-profile", updateProfileValidator, isAuth, updateProfileValidator, validate, authController.updateProfile);
module.exports = router;