import dotenv from "dotenv";

// Load environment variables FIRST before importing anything else
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));

// Stripe webhook needs raw body
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Debug endpoint to check environment variables (remove in production)
app.get("/api/debug/env", (_req, res) => {
  res.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) : "N/A",
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." + process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4) : "N/A",
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
