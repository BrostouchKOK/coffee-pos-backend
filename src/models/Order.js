import mongoose from "mongoose";

// Order Item
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },

  {
    _id: false,
  },
);

// Main Order

const orderSchema = new mongoose.Schema(
  {
    // Receipt Number
    orderNumber: {
      type: String,
      unique: true,
    },

    customerName: {
      type: String,
      default: "Walk-in Customer",
    },

    // Cashier User
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    // Price calculation

    subtotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    // Final total

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,

      enum: ["Cash", "Card", "QR"],

      default: "Cash",
    },

    status: {
      type: String,

      enum: ["Completed", "Cancelled", "Pending"],

      default: "Completed",
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
