const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/Category");

const { addCategoryValidator, idValidator } = require("../validators/Category");
const validate = require("../validators/validate");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.post(
  "/",
  isAuth,
  isAdmin,
  addCategoryValidator,
  validate,
  CategoryController.addCategory
);

router.put(
  "/:id",
  isAuth,
  isAdmin,
  idValidator,
  validate,
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  isAuth,
  isAdmin,
  idValidator,
  validate,
  CategoryController.deleteCategory
);

router.get("/", isAuth, CategoryController.getAllCategories);

router.get(
  "/:id",
  isAuth,
  idValidator,
  validate,
  CategoryController.getCategory
);

module.exports = router;
