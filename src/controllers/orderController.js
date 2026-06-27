import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ======================================
// Create Order (Checkout)
// ======================================

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { customerName, items, paymentMethod } = req.body;

    // Check cart
    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,

        message: "Cart is empty",
      });
    }

    let orderItems = [];

    let totalAmount = 0;

    // Loop products

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();

        return res.status(404).json({
          success: false,

          message: "Product not found",
        });
      }

      // Check stock

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,

          message: `${product.name} is out of stock`,
        });
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,

        name: product.name,

        price: product.price,

        quantity: item.quantity,

        subtotal,
      });

      totalAmount += subtotal;

      // Reduce Stock

      product.stock -= item.quantity;

      await product.save({
        session,
      });
    }

    // Create Order

    const [order] = await Order.create(
      [
        {
          customerName: customerName || "Walk-in Customer",

          cashier: req.user.id,

          items: orderItems,

          totalAmount,

          paymentMethod,

          status: "Completed",
        },
      ],

      {
        session,
      },
    );

    // Finish transaction

    await session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,

      message: "Order created successfully",

      data: order,
    });
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// ======================================
// Get All Orders
// Search + Filter + Pagination
// ======================================

export const getOrders = async (req, res) => {
  try {
    const {
      search,

      status,

      page = 1,

      limit = 10,
    } = req.query;

    const query = {};

    // Search customer

    if (search) {
      query.customerName = {
        $regex: search,

        $options: "i",
      };
    }

    // Filter status

    if (status) {
      query.status = status;
    }

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)

      .populate(
        "cashier",

        "username email",
      )

      .sort({
        createdAt: -1,
      })

      .skip((page - 1) * limit)

      .limit(Number(limit));

    res.json({
      success: true,

      totalOrders,

      totalPages: Math.ceil(totalOrders / limit),

      currentPage: Number(page),

      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// ======================================
// Get Single Order Details
// ======================================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

      .populate(
        "cashier",

        "username email",
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    res.json({
      success: true,

      data: order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// ======================================
// Update Order Status
// ======================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["Pending", "Completed", "Cancelled"];

    // Check status value
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      success: true,

      message: "Order status updated successfully",

      data: order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};
