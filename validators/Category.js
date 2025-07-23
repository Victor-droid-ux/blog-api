const { check, param } = require("express-validator");
const mongoose = require("mongoose");

const addCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
];

const idValidator = [
  param("id").custom((id) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id");
    }
    return true; // Important to return true if valid
  }),
];

module.exports = { addCategoryValidator, idValidator };
