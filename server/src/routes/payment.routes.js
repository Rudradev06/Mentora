import { Router } from "express";
import Stripe from "stripe";
import Course from "../models/Course.model.js";
import Payment from "../models/Payment.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Lazy initialization of Stripe - initialize on first use
let stripe = null;
let stripeInitialized = false;

function getStripe() {
  if (!stripeInitialized) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    console.log("🔍 Initializing Stripe...");
    console.log("   STRIPE_SECRET_KEY exists:", !!stripeKey);
    console.log("   STRIPE_SECRET_KEY length:", stripeKey ? stripeKey.length : 0);
    console.log("   STRIPE_SECRET_KEY starts with:", stripeKey ? stripeKey.substring(0, 10) + "..." : "N/A");
    
    if (stripeKey && stripeKey.trim()) {
      try {
        stripe = new Stripe(stripeKey);
        console.log("✓ Stripe initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Stripe:", error.message);
        stripe = null;
      }
    } else {
      console.warn("⚠️  STRIPE_SECRET_KEY not found or empty. Payment features will be disabled.");
      stripe = null;
    }
    
    stripeInitialized = true;
  }
  
  return stripe;
}

// Create payment intent for course purchase
router.post("/create-payment-intent", requireAuth, requireRole("student"), async (req, res) => {
  // Get Stripe instance (lazy initialization)
  const stripeInstance = getStripe();
  
  if (!stripeInstance) {
    console.error("❌ Payment attempt failed: Stripe not initialized");
    console.error("   Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
    return res.status(503).json({ 
      message: "Payment service is not configured. Please check server configuration." 
    });
  }

  try {
    const { courseId } = req.body;

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not available for purchase" });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = course.enrolledStudents.some(
      studentId => studentId.toString() === req.user.id.toString()
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // Free courses don't need payment
    if (course.price === 0) {
      return res.status(400).json({ message: "This is a free course, no payment required" });
    }

    // Create payment intent
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(course.price * 100), // Convert to cents
      currency: "usd",
      metadata: {
        courseId: course._id.toString(),
        userId: req.user.id.toString(),
        courseName: course.title,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record in database
    await Payment.create({
      user: req.user.id,
      course: courseId,
      amount: course.price,
      currency: "usd",
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: course.price,
      courseName: course.title,
    });
  } catch (err) {
    console.error("Payment intent creation error:", err);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

// Webhook to handle Stripe events
router.post("/webhook", async (req, res) => {
  // Get Stripe instance
  const stripeInstance = getStripe();
  
  if (!stripeInstance) {
    return res.status(503).json({ 
      message: "Payment service is not configured." 
    });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { courseId, userId } = paymentIntent.metadata;

    // Update payment record
    await Payment.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: "completed",
        paidAt: new Date(),
      }
    );

    // Enroll student in course
    const course = await Course.findById(courseId);
    if (course && !course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    console.log(`Payment successful for course ${courseId} by user ${userId}`);
  } catch (err) {
    console.error("Error handling successful payment:", err);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    await Payment.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: "failed",
        failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
      }
    );

    console.log(`Payment failed for intent ${paymentIntent.id}`);
  } catch (err) {
    console.error("Error handling failed payment:", err);
  }
}

// Get user's payment history
router.get("/history", requireAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("course", "title thumbnail")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
});

// Get payment details by ID
router.get("/:paymentId", requireAuth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("course", "title thumbnail price")
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if user owns this payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ payment });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment details" });
  }
});

export default router;
