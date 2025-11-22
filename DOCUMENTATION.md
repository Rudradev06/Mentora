# Mentora - Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [API Documentation](#api-documentation)
5. [Frontend Components](#frontend-components)
6. [Backend Services](#backend-services)
7. [Database Schema](#database-schema)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Features](#features)
10. [Development Guidelines](#development-guidelines)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Mentora** is a modern, full-stack learning management platform built with React, Node.js, Express, and MongoDB. It provides a comprehensive solution for online education with features for course creation, student enrollment, progress tracking, and analytics.

### Key Features
- 🎓 **Course Management**: Create, edit, and manage courses with multimedia content
- 👥 **User Management**: Support for students, teachers, and administrators
- 📊 **Analytics Dashboard**: Real-time statistics and performance tracking
- 🎥 **Video Learning**: Enhanced video player with focus mode and progress tracking
- 📝 **Blog System**: Integrated blog for educational content and announcements
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🔐 **Authentication**: Secure JWT-based authentication system
- 📈 **Progress Tracking**: Detailed learning progress and completion tracking

### Technology Stack

#### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API communication

#### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling library
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library
- **CORS** - Cross-origin resource sharing middleware

#### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Nodemon** - Development server with auto-restart

---

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Project Structure

```
mentora/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose data models
│   │   ├── routes/         # API route handlers
│   │   ├── scripts/        # Database seed scripts
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── README.md               # Project overview
├── DOCUMENTATION.md        # This comprehensive documentation
└── start scripts           # Development startup scripts
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** package manager
- **Git** for version control

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd mentora
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cd ../server
   cp .env.example .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Windows: Start MongoDB service from Services
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Option 1: Use start scripts
   # Windows PowerShell: ./start.ps1
   # Windows CMD: start.bat
   
   # Option 2: Manual start
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mentora

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

### Course Endpoints

#### GET /api/courses
Get all published courses with optional filtering.

**Query Parameters:**
- `category` - Filter by course category
- `level` - Filter by difficulty level
- `search` - Search in title and description
- `limit` - Number of courses to return
- `page` - Page number for pagination

#### GET /api/courses/:id
Get detailed information about a specific course.

#### POST /api/courses
Create a new course (teachers and admins only).

#### PUT /api/courses/:id
Update an existing course (course instructor or admin only).

#### DELETE /api/courses/:id
Delete a course (course instructor or admin only).

#### POST /api/courses/:id/enroll
Enroll in a course (students only).

#### POST /api/courses/:id/review
Add a review to a course (enrolled students only).

### Statistics Endpoints

#### GET /api/stats
Get platform-wide statistics.

#### GET /api/stats/trending
Get trending courses based on recent enrollments and ratings.

---

## Frontend Components

### Component Architecture

```
src/
├── components/          # Reusable UI components
│   ├── CourseAnalytics.jsx
│   ├── CourseManagement.jsx
│   ├── CourseShowcase.jsx
│   ├── ErrorBoundary.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── Navbar.jsx
│   ├── NewsletterSignup.jsx
│   ├── PlatformFeatures.jsx
│   ├── ProtectedRoute.jsx
│   ├── SocialProofSection.jsx
│   └── TestimonialsSection.jsx
├── pages/               # Page-level components
│   ├── BlogPage.jsx
│   ├── BlogPostPage.jsx
│   ├── CourseDetailPage.jsx
│   ├── CourseLearnPage.jsx
│   ├── CoursesPage.jsx
│   ├── CreateCoursePage.jsx
│   ├── DashboardPage.jsx
│   ├── EditCoursePage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── MyCoursesPage.jsx
│   ├── PageNotFound.jsx
│   └── RegisterPage.jsx
├── context/             # React context providers
│   └── AuthContext.jsx
└── services/            # API service functions
    └── api.js
```

### Key Components

#### AuthContext
Provides authentication state and functions throughout the app.

```jsx
const { user, login, logout, isAuthenticated, loading } = useAuth();
```

#### ProtectedRoute
Wrapper component for routes that require authentication.

```jsx
<ProtectedRoute requiredRole="teacher">
  <CreateCoursePage />
</ProtectedRoute>
```

#### CourseLearnPage
Enhanced learning interface with focus mode and video player.

**Features:**
- Focus mode for distraction-free learning
- Video player with custom controls
- Progress tracking and lesson navigation
- Note-taking functionality
- Lesson completion tracking

---

## Backend Services

### Service Architecture

```
server/src/
├── config/
│   └── database.js      # MongoDB connection
├── middleware/
│   └── auth.js          # JWT authentication
├── models/
│   ├── Course.model.js  # Course data model
│   └── User.model.js    # User data model
├── routes/
│   ├── auth.routes.js   # Authentication endpoints
│   ├── course.routes.js # Course management endpoints
│   └── stats.routes.js  # Statistics endpoints
├── scripts/
│   └── seedData.js      # Database seeding
├── utils/
│   └── jwt.js           # JWT utilities
├── app.js               # Express app setup
└── server.js            # Server entry point
```

### Database Models

#### User Model
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default: 'student' 
  }
}, { timestamps: true });
```

#### Course Model
```javascript
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  price: { type: Number, default: 0 },
  thumbnail: String,
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: [{
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    materials: [String],
    duration: String,
    order: { type: Number, default: 0 }
  }],
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });
```

---

## User Roles & Permissions

### Role Hierarchy

1. **Admin** - Full system access
2. **Teacher** - Course creation and management
3. **Student** - Course enrollment and learning

### Permission Matrix

| Action | Student | Teacher | Admin |
|--------|---------|---------|-------|
| View published courses | ✅ | ✅ | ✅ |
| Enroll in courses | ✅ | ❌ | ✅ |
| Create courses | ❌ | ✅ | ✅ |
| Edit own courses | ❌ | ✅ | ✅ |
| Edit any course | ❌ | ❌ | ✅ |
| Delete own courses | ❌ | ✅ | ✅ |
| Delete any course | ❌ | ❌ | ✅ |
| View course analytics | ❌ | ✅ (own) | ✅ (all) |
| Manage users | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |

---

## Features

### 1. Course Management System

#### Course Creation Wizard
- **Step 1**: Basic Information (title, description, category)
- **Step 2**: Course Content (lessons, videos, materials)
- **Step 3**: Pricing & Settings
- **Step 4**: Review & Publish

#### Content Management
- Video upload and streaming
- Document attachments
- Lesson ordering and organization
- Progress tracking setup

#### Course Analytics
- Student enrollment tracking
- Revenue analytics
- Completion rate monitoring
- Geographic distribution
- Engagement metrics

### 2. Learning Experience

#### Enhanced Video Player
- Custom controls and playback speed
- Focus mode for distraction-free learning
- Progress tracking and bookmarking
- Subtitle support
- Mobile-responsive design

#### Progress Tracking
- Lesson completion status
- Overall course progress
- Time spent learning
- Achievement badges
- Learning streaks

### 3. User Management

#### Authentication System
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Session management
- Secure logout

#### User Profiles
- Personal information management
- Learning history
- Achievement tracking
- Course enrollment history
- Progress statistics

### 4. Blog System

#### Content Management
- Rich text editor
- Category organization
- Tag system
- Featured articles
- SEO optimization

#### Reader Experience
- Responsive design
- Search functionality
- Category filtering
- Related articles
- Newsletter signup

### 5. Analytics Dashboard

#### Platform Statistics
- Total users and courses
- Enrollment trends
- Revenue tracking
- User engagement metrics
- Geographic distribution

#### Course Analytics
- Individual course performance
- Student progress tracking
- Completion rates
- Review and rating analysis
- Revenue per course

---

## Development Guidelines

### Code Style

#### JavaScript/React
```javascript
// Use functional components with hooks
const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

#### CSS/Tailwind
```jsx
// Use Tailwind utility classes
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click me
</button>
```

### File Organization

#### Import Order
```javascript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 2. Internal utilities and services
import { api } from '../services/api';
import { formatDate } from '../utils/helpers';

// 3. Components
import Button from '../components/Button';
import Modal from '../components/Modal';
```

### API Integration

#### Service Layer Pattern
```javascript
// services/api.js
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`)
};
```

#### Error Handling
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    setError(error.response?.data?.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

---

## Deployment

### Production Environment Setup

#### Environment Variables
```env
# Production .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-production-db/mentora
JWT_SECRET=your-super-secure-production-secret
CLIENT_URL=https://your-domain.com
```

#### Build Process
```bash
# Build frontend for production
cd client
npm run build

# The build folder will contain optimized static files
```

### Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    environment:
      MONGO_INITDB_DATABASE: mentora
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./server
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://mongodb:27017/mentora
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongodb
    ports:
      - "5000:5000"

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues

**Problem**: `MongoNetworkError: failed to connect to server`

**Solutions**:
```bash
# Check if MongoDB is running
# Windows: Check Services for MongoDB
# macOS: brew services list | grep mongodb
# Linux: sudo systemctl status mongod

# Start MongoDB if not running
# Windows: Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/mentora
```

#### 2. JWT Authentication Errors

**Problem**: `JsonWebTokenError: invalid token`

**Solutions**:
```javascript
// Check JWT_SECRET in .env
JWT_SECRET=your-secret-key-here

// Verify token format in requests
Authorization: Bearer <token>

// Check token expiration
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### 3. CORS Issues

**Problem**: CORS policy blocking requests

**Solutions**:
```javascript
// Update CORS configuration in server/src/app.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true
}));

// Or set CLIENT_URL in .env
CLIENT_URL=http://localhost:5173
```

#### 4. Video Player Issues

**Problem**: "No video with supported format and MIME type found"

**Solutions**:
```javascript
// Ensure video URLs are accessible
// Check video format (MP4 recommended)
// Verify CORS headers for video files

// Add multiple source formats
<video controls>
  <source src={videoUrl} type="video/mp4" />
  <source src={videoUrl} type="video/webm" />
  <source src={videoUrl} type="video/ogg" />
</video>
```

#### 5. Build Errors

**Problem**: Build fails with dependency errors

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update

# Check for peer dependency warnings
npm ls
```

### Performance Optimization

#### Frontend Optimization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Render logic */}</div>;
});

// Implement lazy loading
const LazyComponent = lazy(() => import('./LazyComponent'));

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### Backend Optimization
```javascript
// Add database indexes
db.courses.createIndex({ "title": "text", "description": "text" });

// Implement pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const courses = await Course.find()
  .skip(skip)
  .limit(limit)
  .populate('instructor', 'name email');
```

---

## Support and Contributing

### Getting Help

- **Documentation**: Check this comprehensive guide first
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Contributing Guidelines

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Follow coding standards and add tests
4. **Commit Changes**: `git commit -m 'Add amazing feature'`
5. **Push to Branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**: Describe changes and link related issues

---

## License

This project is licensed under the MIT License.

---

## Changelog

### Version 1.0.0 (Current)
- Initial release with core functionality
- Course creation and management system
- User authentication and authorization
- Enhanced learning interface with video player
- Blog system with content management
- Real-time analytics and statistics
- Responsive design and mobile support
- Comprehensive API documentation

### Planned Features (v1.1.0)
- Real-time chat and messaging
- Advanced search and filtering
- Mobile application
- Integration with external tools
- Advanced analytics and reporting
- Automated testing suite
- Performance optimizations

---

*This documentation is maintained by the Mentora development team. Last updated: December 2024*