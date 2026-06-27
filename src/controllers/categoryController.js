import Category from "../models/Category.js";

// =========================
// Create Category
// =========================
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // Duplicate check (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Get All Categories
// =========================
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Get Category by ID
// =========================
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Update Category
// =========================
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check duplicate (excluding current category)
    const duplicate = await Category.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    category.name = name.trim();

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================
// Delete Category
// =========================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
