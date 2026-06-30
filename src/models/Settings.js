import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Cafe Information
    cafeName: {
      type: String,
      required: true,
      default: "My Coffee Shop",
    },

    logo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    // Currency
    currency: {
      type: String,
      enum: ["USD", "KHR"],
      default: "USD",
    },

    exchangeRate: {
      type: Number,
      default: 4000,
    },

    // Receipt Tax
    tax: {
      type: Number,
      default: 0,
    },

    // Receipt Footer
    receiptFooter: {
      type: String,
      default: "Thank you for your visit!",
    },

    // Optional receipt settings
    showLogo: {
      type: Boolean,
      default: true,
    },

    showQRCode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Settings", settingsSchema);
