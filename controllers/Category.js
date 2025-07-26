const { Category, User } = require("../models");
const mongoose = require("mongoose");

// Add Category
const addCategory = async (req, res, next) => {
  try {
    let { title, name, description } = req.body;
    const { _id } = req.user;

    if (!_id) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Unauthorized: User ID not found",
      });
    }

    title = title?.trim().toLowerCase();
    name = name?.trim().toLowerCase();
    description = description?.trim();

    const isCategoryExist = await Category.findOne({ title, name });
    if (isCategoryExist) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Category already exists",
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "User not found",
      });
    }

    const category = await Category.create({
      title,
      name,
      description,
      createdBy: _id,
      updatedBy: _id,
      isDeleted: false,
    });

    user.categories = Array.isArray(user.categories) ? user.categories : [];
    user.categories.push(category._id);
    await user.save();

    return res.status(201).json({
      code: 201,
      status: true,
      message: "Category added successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    let { title, name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    title = title?.trim().toLowerCase();
    name = name?.trim().toLowerCase();
    description = description?.trim();

    const existing = await Category.findOne({
      _id: { $ne: categoryId },
      title,
      name,
    });

    if (existing) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Category with same title and name already exists",
      });
    }

    if (title) category.title = title;
    if (name) category.name = name;
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

// Soft Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    category.isDeleted = true;
    await category.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Category soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get All Categories with Filters
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

    const query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (deleted === "true") query.isDeleted = true;
    else if (deleted === "false") query.isDeleted = false;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const sortDirection = order === "asc" ? 1 : -1;

    const categories = await Category.find(query)
      .populate("createdBy", "username email")
      .populate("updatedBy", "username email")
      .sort({ [sort]: sortDirection })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    const total = await Category.countDocuments(query);
    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Categories fetched successfully",
      pagination: {
        total,
        page: parsedPage,
        totalPages,
        limit: parsedLimit,
      },
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Category
const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id)
      .populate("createdBy", "username email")
      .populate("updatedBy", "username email")
      .lean();

    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
};
