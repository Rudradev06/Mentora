# Mentora - Modern Learning Platform

A full-stack learning platform built with React, Node.js, Express, and MongoDB.

## 🎓 **Advanced Course Creation & Management Features**

### ✅ **Multi-Step Course Creation Wizard**
- **Step 1 - Basic Info**: Course title, description, category, level, prerequisites, and learning objectives
- **Step 2 - Content Management**: Add unlimited lessons with videos, materials, and descriptions
- **Step 3 - Settings**: Pricing, tags, and publication settings
- **Step 4 - Preview**: Review and publish your course

### ✅ **Rich Content Management**
- **Lesson Builder**: Create detailed lessons with titles, descriptions, video URLs, and downloadable materials
- **Content Organization**: Structured lesson ordering with duration tracking
- **Media Support**: Video integration and file attachments
- **Smart Validation**: Real-time form validation with helpful error messages

### ✅ **Comprehensive Instructor Dashboard**
- **Course Analytics**: Detailed performance metrics, enrollment trends, and revenue tracking
- **Student Management**: View enrolled students and engagement statistics
- **Course Management**: Edit, publish/unpublish, delete courses with advanced filtering
- **Quick Actions**: Bulk operations and status management

### ✅ **Enhanced Course Features**
- **Advanced Search & Filtering**: Filter by status, category, rating, and enrollment count
- **Draft System**: Save courses as drafts before publishing
- **Rich Metadata**: Tags, prerequisites, learning objectives for better discoverability
- **Analytics Dashboard**: Revenue tracking, completion rates, and student demographics

## Core Features

- **User Authentication** (Students, Teachers, Admins with role-based access)
- **Interactive Landing Page** (Real-time stats, trending courses, testimonials)
- **Course Enrollment** (One-click enrollment with status tracking)
- **Course Reviews & Ratings** (Student feedback system)
- **Responsive Design** (Mobile-friendly interface)
- **Real-time Statistics** (Platform analytics and course metrics)

## Tech Stack

### Frontend
- React 19
- React Router
- Tailwind CSS
- Axios
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd mentora
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentora-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Seed Sample Data (Optional)
```bash
cd server
npm run seed
```

This will create sample users and courses:
- **Admin**: admin@example.com / password123
- **Teacher 1**: john@example.com / password123
- **Teacher 2**: sarah@example.com / password123
- **Student 1**: alice@example.com / password123
- **Student 2**: bob@example.com / password123

### 6. Start the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course (teachers/admins)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)
- `POST /api/courses/:id/enroll` - Enroll in course (students)
- `GET /api/courses/enrolled/my-courses` - Get enrolled courses
- `GET /api/courses/my-courses/created` - Get created courses (teachers)
- `POST /api/courses/:id/review` - Add course review (students)

## User Roles

### Student
- Browse and search courses
- Enroll in courses
- Access course content after enrollment
- Leave reviews and ratings
- View personal dashboard with enrolled courses

### Teacher
- Create and manage courses
- Upload course content (videos, materials)
- View enrolled students
- Publish/unpublish courses
- View course analytics

### Admin
- All teacher permissions
- Manage all users
- Manage all courses
- System administration
- First registered user automatically becomes admin

## Project Structure

```
mentora/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Utility scripts
│   │   ├── utils/         # Helper functions
│   │   └── ...
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Logout Error**: If you encounter errors when logging out, make sure you're using the latest version of the code. The logout functionality has been updated to use React Router navigation instead of window.location.

2. **Server Connection Issues**: 
   - Make sure MongoDB is running
   - Check that the `.env` file exists in the server directory
   - Verify the MONGO_URI in your `.env` file

3. **CORS Issues**: The server is configured to accept requests from any origin. If you encounter CORS issues, check your browser's developer console.

4. **Authentication Issues**: 
   - Clear your browser's localStorage if you encounter token-related issues
   - Make sure the JWT_SECRET is set in your `.env` file

### Testing the Server

Run the test script to verify server connectivity:
```bash
node test-server.js
```

Test enrollment functionality:
```bash
node test-enrollment.js
```

### Development Tips

- Use the browser's developer tools to check for console errors
- Check the Network tab to see API requests and responses
- The application includes error boundaries to catch React errors
- Protected routes will redirect to login if not authenticated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.