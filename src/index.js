import express from "express";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import diaryRoutes from "./routes/diary.route.js";
import profileRouter from "./routes/user.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import workoutRouter from "./routes/workout.route.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"; // <--- הוספה 1: ייבוא path

dotenv.config();
const app = express();

const __dirname = path.resolve(); // <--- הוספה 2: הגדרת __dirname

// Middleware configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fitness-app-1-q392.onrender.com",
    ],
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/workouts", workoutRouter);

// --- הוספה 3: הגשת ה-Frontend בייצור ---
if (process.env.NODE_ENV === "production") {
  // הגשת קבצים סטטיים מתיקיית ה-dist של הלקוח
  app.use(express.static(path.join(__dirname, "/client/dist")));

  // כל בקשה שלא טופלה ע"י ה-API תופנה לקובץ ה-HTML הראשי של ריאקט
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}
// ----------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB();
});
