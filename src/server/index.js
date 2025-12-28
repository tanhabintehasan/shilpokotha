import express from "express";
import dotenv from "dotenv";
import path from "path"; // duplicate import path removed
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// --- IMPORT DATABASE & ROUTES ---
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminauthRoutes from "./routes/adminauthRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productSliderRoute from "./routes/productSliderRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// --- GLOBAL MIDDLEWARE ---
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
}));

app.use(morgan("dev"));

// --- UPDATED CORS FOR PRODUCTION ---
// এখানে আপনার ফ্রন্টএন্ডের মেইন ডোমেইন এবং ভেরসেল ডোমেইন দুটোই এলাউ করুন
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://shilpokotha.vercel.app", // আপনার ফ্রন্টএন্ড মেইন লিংক
            /\.vercel\.app$/ // এটি ভেরসেলের সব সাবডোমেইন এলাউ করবে
        ];
        if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files (Local Dev এর জন্য)
const uploadDir = path.join(__dirname, "uploads");
if (fs.existsSync(uploadDir)) {
    app.use("/uploads", express.static(uploadDir));
}

// --- API ROUTES ---
app.use("/api/products", productRoutes);
app.use("/api/product-slider", productSliderRoute);
app.use("/api/admin", adminauthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Shilpo Kotha API is running..." });
});

// --- 404 HANDLER ---
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(err.status || 500).json({
        message: "Internal Server Error",
        error: err.message
    });
});

// --- SERVER INITIALIZATION ---
// Vercel এ deploy করলে listen() দরকার নেই, তবে লোকালহোস্টের জন্য এটি লাগবে
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Local server running on http://localhost:${PORT}`);
    });
}

export default app;