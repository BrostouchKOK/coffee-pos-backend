import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
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

    currency: {
      type: String,
      default: "$",
    },

    tax: {
      type: Number,
      default: 0,
    },

    receiptFooter: {
      type: String,
      default: "Thank you for your visit!",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Settings", settingsSchema);
