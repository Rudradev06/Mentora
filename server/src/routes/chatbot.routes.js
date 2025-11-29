import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Course from "../models/Course.model.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Use the latest stable model (gemini-2.5-flash is the newest fast model)
const MODEL_NAME = "gemini-2.5-flash";

// Helper function to get Gemini AI instance (lazy initialization)
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Test endpoint to verify Gemini API
router.get("/test", requireAuth, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        configured: false,
        message: "GEMINI_API_KEY not found in environment variables"
      });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent("Say 'Hello, Gemini is working!' in a friendly way.");
    const response = await result.response;
    const text = response.text();

    res.json({
      configured: true,
      working: true,
      testResponse: text,
      message: "Gemini API is working correctly!"
    });
  } catch (error) {
    res.status(500).json({
      configured: true,
      working: false,
      error: error.message,
      message: "Gemini API key is configured but not working. Check if the key is valid."
    });
  }
});

// Chat endpoint
router.post("/chat", requireAuth, async (req, res) => {
  try {
    const { message, courseId, conversationHistory } = req.body;

    console.log("📨 Chat request received:", { 
      message: message.substring(0, 50), 
      courseId, 
      hasHistory: !!conversationHistory 
    });

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log("⚠️ GEMINI_API_KEY not configured");
      return res.status(503).json({ 
        message: "AI service not configured. Using fallback responses.",
        fallback: true 
      });
    }

    // Get course context if courseId is provided
    let courseContext = "";
    if (courseId) {
      try {
        const course = await Course.findById(courseId)
          .populate("instructor", "name")
          .populate("reviews.user", "name");

        if (course) {
          courseContext = `
Current Course Context:
- Title: ${course.title}
- Description: ${course.description}
- Category: ${course.category}
- Level: ${course.level}
- Duration: ${course.duration}
- Price: $${course.price}
- Instructor: ${course.instructor.name}
- Rating: ${course.rating.toFixed(1)}/5 (${course.reviews.length} reviews)
- Enrolled Students: ${course.enrolledStudents.length}
- Number of Lessons: ${course.content.length}
${course.content.length > 0 ? `- Lesson Topics: ${course.content.map(l => l.title).join(", ")}` : ""}
`;
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    }

    // Build conversation context
    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation:\n";
      conversationHistory.slice(-5).forEach((msg) => {
        conversationContext += `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}\n`;
      });
    }

    // Create system prompt
    const systemPrompt = `You are Mentora AI, a helpful and friendly assistant for the Mentora online learning platform. 

Your role:
- Help users with course-related questions
- Provide information about enrollment, pricing, and features
- Guide users through the platform
- Answer questions about specific courses when context is provided
- Be concise, friendly, and helpful
- Use emojis occasionally to be more engaging
- If you don't know something, be honest and suggest contacting support

Platform Information:
- Mentora is an online learning platform
- Offers courses for students and tools for instructors
- Features: video lessons, progress tracking, reviews, certificates
- Support email: hello@mentora.com
- Users can browse courses at /courses
- Enrolled courses at /my-courses
- User profile at /profile

${courseContext}

Guidelines:
- Keep responses concise (2-4 paragraphs max)
- Be conversational and friendly
- Use bullet points (•) for lists
- Use **bold** for emphasis on important points
- Use line breaks between sections for readability
- Provide actionable next steps
- Don't make up information about courses not in context
${conversationContext}`;

    // Generate response using Gemini
    console.log("🤖 Generating AI response...");
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    const prompt = `${systemPrompt}\n\nUser question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Get the text and clean it
    let botReply = response.text();
    
    // Ensure we have a valid response
    if (!botReply || botReply.trim().length === 0) {
      botReply = "I apologize, but I couldn't generate a proper response. Could you please rephrase your question?";
    }
    
    // Clean up any potential formatting issues
    botReply = botReply.trim();

    console.log("✅ AI response generated successfully:", botReply.substring(0, 100) + "...");

    res.json({
      message: botReply,
      courseContext: !!courseId,
      timestamp: new Date(),
      isAI: true
    });

  } catch (error) {
    console.error("❌ Chatbot error:", error.message);
    console.error("Error details:", error);
    
    // Check error type and provide appropriate message
    let errorMessage = "I'm having trouble connecting right now. Please try again or contact support at hello@mentora.com for immediate assistance. 🙏";
    let shouldFallback = true;
    
    if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
      errorMessage = "I apologize, but I couldn't process that request. Could you please rephrase your question in a different way? 🤔";
    } else if (error.message?.includes("quota") || error.message?.includes("limit")) {
      errorMessage = "I'm experiencing high demand right now. Please try again in a moment. 🙏";
    } else if (error.message?.includes("API key") || error.message?.includes("403") || error.message?.includes("unregistered callers")) {
      errorMessage = "⚠️ AI service is not properly configured. The API key is invalid or missing. Please check the setup guide.";
      console.error("🔑 INVALID API KEY - Please get a valid key from https://makersuite.google.com/app/apikey");
      shouldFallback = true;
    } else if (error.message?.includes("404") || error.message?.includes("not found")) {
      errorMessage = "The AI model is temporarily unavailable. Using fallback responses.";
    }
    
    // Return fallback response
    res.status(500).json({
      message: errorMessage,
      error: true,
      fallback: shouldFallback,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get course suggestions based on query
router.post("/suggest-courses", requireAuth, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Search courses based on query
    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    })
      .populate("instructor", "name")
      .limit(5)
      .select("title description category level price rating enrolledStudents thumbnail");

    res.json({ courses });
  } catch (error) {
    console.error("Course suggestion error:", error);
    res.status(500).json({ message: "Failed to fetch course suggestions" });
  }
});

export default router;
