const { Category, User } = require("../models");

const addCategory = async (req, res, next) => {
  try {
    const { title, name, description } = req.body;
    const { _id } = req.user; // Make sure isAuth middleware sets this

    // Check if category already exists
    const isCategoryExist = await Category.findOne({ title, name });
    if (isCategoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Validate user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create new category
    const category = await Category.create({
      title,
      name,
      description,
      createdBy: _id,
      updatedBy: _id,
    });

    // Push to user's categories array if it exists
    if (!Array.isArray(user.categories)) {
      user.categories = [];
    }
    user.categories.push(category._id);
    await user.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Category added successfully",
      data: { category },
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

module.exports = { addCategory };
