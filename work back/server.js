import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بـ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
import authRoutes from "./src/routes/AuthRoutes.js";
import offerRoutes from "./src/routes/OfferRoutes.js";
import applicationRoutes from "./src/routes/ApplicationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/applications", applicationRoutes);

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});