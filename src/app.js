import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({
//     message: "Coffee POS API Running",
//   });
// });
app.use("/uploads", express.static(path.join("src/uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;
