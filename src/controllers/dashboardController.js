import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    // =============================
    // Today
    // =============================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // =============================
    // Total Sales
    // =============================

    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    // =============================
    // Today's Sales
    // =============================

    const todaySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    // =============================
    // Counts
    // =============================

    const totalOrders = await Order.countDocuments();

    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments();

    // =============================
    // Recent Orders
    // =============================

    const recentOrders = await Order.find()
      .populate("cashier", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    // =============================
    // Top Selling Products
    // =============================

    const topProducts = await Order.aggregate([
      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",

          name: {
            $first: "$items.name",
          },

          sold: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          sold: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    // =============================
    // Monthly Sales
    // =============================

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          sales: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = monthlySales.map((item) => ({
      month: months[item._id.month - 1],
      sales: item.sales,
    }));

    // =============================
    // Response
    // =============================

    res.status(200).json({
      success: true,

      data: {
        totalSales: totalSales.length > 0 ? totalSales[0].total : 0,

        todaySales: todaySales.length > 0 ? todaySales[0].total : 0,

        totalOrders,

        todayOrders,

        totalProducts,

        totalUsers,

        recentOrders,

        topProducts,

        monthlySales: chartData,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
