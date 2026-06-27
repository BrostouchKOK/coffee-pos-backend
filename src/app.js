import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({
//     message: "Coffee POS API Running",
//   });
// });

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
