// controllers/settingsController.js

import Settings from "../models/Settings.js";

// ======================================
// GET Settings
// GET /api/settings
// ======================================

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load settings.",
    });
  }
};

// ======================================
// UPDATE Settings
// PUT /api/settings
// ======================================

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const { cafeName, address, phone, email, currency, tax, receiptFooter } =
      req.body;

    // Update text fields
    settings.cafeName = cafeName;
    settings.address = address;
    settings.phone = phone;
    settings.email = email;
    settings.currency = currency;
    settings.tax = tax;
    settings.receiptFooter = receiptFooter;

    // Update logo if uploaded
    if (req.file) {
      settings.logo = `/uploads/${req.file.filename}`;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
};
