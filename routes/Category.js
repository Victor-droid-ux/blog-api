const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const { addCategoryValidator } = require("../validators/Category");
const validate = require("../validators/validate");
const isAuth = require("../middleware/isAuth");

router.post(
  "/",
  isAuth,
  addCategoryValidator,
  validate,
  CategoryController.addCategory
);

module.exports = router;
