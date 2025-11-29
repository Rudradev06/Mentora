# Mentora - Learning Management Platform

A full-stack learning platform with AI-powered chatbot, video courses, quizzes, and certificates.

## Features

- **User Authentication** - Role-based access (Student, Teacher, Admin)
- **Course Management** - Create, edit, and publish courses with video lessons
- **Video Player** - Full-screen player with progress tracking
- **AI Chatbot** - Google Gemini-powered assistant with course context
- **Quiz System** - Timed quizzes with automatic grading
- **Certificates** - Generated on quiz completion (70%+ required)
- **Payment Integration** - Stripe for course purchases
- **Progress Tracking** - Lesson completion and course progress
- **Reviews & Ratings** - Student feedback system

## Tech Stack

**Frontend:** React 19, React Router, Tailwind CSS, Axios, Stripe  
**Backend:** Node.js, Express, MongoDB, JWT, Google Gemini AI  
**Payment:** Stripe  
**AI:** Google Generative AI (Gemini 2.5 Flash)

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Stripe Account
- Google Gemini API Key

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd mentora
cd server && npm install
cd ../client && npm install
```

2. **Configure Environment**

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentora
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
GEMINI_API_KEY=your-gemini-key
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

3. **Start Application**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Access at: http://localhost:5173

### Default Users (after seeding)
```bash
cd server && npm run seed
```
- Admin: admin@example.com / password123
- Teacher: john@example.com / password123
- Student: alice@example.com / password123

## Key Routes

**Frontend:**
- `/` - Landing page
- `/courses` - Browse courses
- `/courses/:id` - Course details
- `/courses/:id/learn` - Video player
- `/courses/:id/quiz` - Course quiz
- `/dashboard` - User dashboard
- `/my-courses` - Enrolled courses

**API:**
- `/api/auth/*` - Authentication
- `/api/courses/*` - Course management
- `/api/payment/*` - Stripe payments
- `/api/chatbot/*` - AI chatbot
- `/api/stats/*` - Platform statistics

## User Roles

- **Student** - Enroll, watch videos, take quizzes, get certificates
- **Teacher** - Create courses, manage content, view analytics
- **Admin** - Full platform access and management

## Documentation

- `CHATBOT_DOCUMENTATION.md` - AI chatbot features and setup
- `GEMINI_SETUP_GUIDE.md` - Google Gemini API configuration
- `FUNCTIONALITY_TEST_REPORT.md` - Complete feature testing report

## License

MIT License