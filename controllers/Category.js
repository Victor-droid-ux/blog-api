const { Category, User } = require("../models");
const mongoose = require("mongoose");

const addCategory = async (req, res, next) => {
  try {
    let { title, name, description } = req.body;
    const { _id } = req.user;

    // Ensure authenticated user
    if (!_id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in request" });
    }

    // Normalize input
    title = title?.trim().toLowerCase();
    name = name?.trim().toLowerCase();

    // Check if category already exists
    const isCategoryExist = await Category.findOne({ title, name });
    if (isCategoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Validate user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new category
    const category = await Category.create({
      title,
      name,
      description,
      createdBy: _id,
      updatedBy: _id,
    });

    // Add category to user's list
    if (!Array.isArray(user.categories)) {
      user.categories = [];
    }
    user.categories.push(category._id);
    await user.save();

    return res.status(201).json({
      code: 201,
      status: true,
      message: "Category added successfully",
      data: { category },
    });
  } catch (error) {
    next(error); // Let global error handler deal with it
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    const { title, description, name } = req.body;

    // Normalize inputs
    const normalizedTitle = title?.trim().toLowerCase();
    const normalizedName = name?.trim().toLowerCase();

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent duplicate title-name pair by another category
    const existing = await Category.findOne({
      title: normalizedTitle,
      name: normalizedName,
    });
    if (existing && existing._id.toString() !== categoryId.toString()) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Update category fields
    if (title) category.title = normalizedTitle;
    if (name) category.name = normalizedName;
    if (description) category.description = description;
    category.updatedBy = userId;

    await category.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      from,
      to,
      deleted,
    } = req.query;

    // Build the query
    let query = {};

    // Text search (q)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    console.log(query);

    // Soft delete filter
    if (deleted === "true") {
      query.isDeleted = true;
    } else if (deleted === "false") {
      query.isDeleted = false;
    }

    // Date filtering
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // Sorting direction
    const sortDirection = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categories = await Category.find(query)
      .populate("createdBy", "username email")
      .populate("updatedBy", "username email")
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Category.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Categories fetched successfully",
      pagination: {
        total,
        page: parseInt(page),
        totalPages,
        limit: parseInt(limit),
      },
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 🔐 Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid category ID format",
      });
    }

    // 🔎 Fetch with population
    const category = await Category.findById(id)
      .populate("createdBy", "username email")
      .populate("updatedBy", "username email");

    // ❌ Not found
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    // ✅ Success
    res.status(200).json({
      code: 200,
      status: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error); // Let global error handler deal with it
  }
};

module.exports = { getCategory };

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
};
