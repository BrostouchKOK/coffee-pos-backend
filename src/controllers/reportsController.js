import Order from "../models/Order.js";

// ======================================
// Sales Summary
// GET /api/reports/summary
// ======================================

export const getSalesSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const getTotal = async (match) => {
      const result = await Order.aggregate([
        {
          $match: {
            status: "Completed",
            ...match,
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

      return result.length ? result[0].total : 0;
    };

    const todaySales = await getTotal({
      createdAt: {
        $gte: today,
      },
    });

    const weekSales = await getTotal({
      createdAt: {
        $gte: weekStart,
      },
    });

    const monthSales = await getTotal({
      createdAt: {
        $gte: monthStart,
      },
    });

    const totalRevenue = await getTotal({});

    res.status(200).json({
      success: true,
      data: {
        todaySales,
        weekSales,
        monthSales,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales summary.",
    });
  }
};

// ======================================
// Top Selling Products
// GET /api/reports/top-products
// ======================================

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",

          name: {
            $first: "$items.name",
          },

          totalSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: "$items.subtotal",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load top products.",
    });
  }
};

// ======================================
// Payment Method Report
// GET /api/reports/payment-methods
// ======================================

export const getPaymentMethods = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },

      {
        $group: {
          _id: "$paymentMethod",

          totalSales: {
            $sum: "$totalAmount",
          },

          totalOrders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalSales: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load payment report.",
    });
  }
};

// ======================================
// Date Range Report
// GET /api/reports/date-range?start=2026-07-01&end=2026-07-31
// ======================================

export const getDateRangeReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Please provide start and end dates.",
      });
    }

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      status: "Completed",

      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("cashier", "username")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    res.status(200).json({
      success: true,

      totalOrders: orders.length,

      totalRevenue,

      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report.",
    });
  }
};

// ======================================
// Sales Chart
// GET /api/reports/sales-chart
// ======================================

export const getSalesChart = async (req, res) => {
  try {
    const chartData = await Order.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          sales: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const data = chartData.map((item) => ({
      date: item._id,
      sales: item.sales,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales chart.",
    });
  }
};
