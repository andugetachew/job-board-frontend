# Job Board Frontend

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)

A modern, responsive job board frontend built with React and Tailwind CSS. Features job search, application management, employer dashboard, and company reviews.

## 🚀 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 18 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router DOM 6 |
| **HTTP Client** | Axios |
| **Build Tool** | Vite 5 |
| **State Management** | Context API |

## ✨ Features

### Candidate Features
- Browse jobs with search & filters
- Job details page
- Apply with resume upload (PDF, DOC, DOCX, TXT)
- Save/unsave jobs to wishlist
- View application status
- Withdraw applications
- Update resume
- Company reviews & ratings

### Employer Features
- Post new jobs
- Edit/delete job postings
- View applications per job
- Update application status (pending → reviewed → interview → hired/rejected)
- Company profile
- View applicant profiles

### Admin Features
- Dashboard with statistics
- View recent jobs and users
- Flag inappropriate jobs
- Block/unblock users

### Profile & Settings
- Update profile (username, email, phone, bio, location)
- Upload profile picture/avatar
- Change password
- Forgot/Reset password
- Email notification preferences
- Privacy settings

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/andugetachew/job-board-frontend.git
cd job-board-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run development server
npm run dev
Environment Variables
Create .env file:

env
VITE_API_URL=http://localhost:8000/api
🚀 Running the Application
bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
📁 Project Structure
text
job-board-frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx           # Navigation bar
│   ├── context/
│   │   └── AuthContext.jsx      # JWT authentication
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   ├── JobList.jsx          # Browse jobs with filters
│   │   ├── JobDetail.jsx        # Job details & apply
│   │   ├── MyApplications.jsx   # Candidate applications
│   │   ├── SavedJobs.jsx        # Saved jobs list
│   │   ├── PostJob.jsx          # Employer job posting
│   │   ├── MyJobs.jsx           # Employer job management
│   │   ├── EmployerApplications.jsx  # Review applications
│   │   ├── Profile.jsx          # User profile settings
│   │   ├── AdminDashboard.jsx   # Admin panel
│   │   └── CompanyReviews.jsx   # Company reviews
│   ├── services/
│   │   └── api.js               # Axios configuration
│   ├── App.jsx                  # Routes & layout
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind imports
├── public/                      # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
🎨 Pages & Routes
Route	Page	Access
/login	Login	Public
/register	Register	Public
/jobs	Browse Jobs	Public
/jobs/:id	Job Details	Public
/my-applications	My Applications	Candidate
/saved-jobs	Saved Jobs	Candidate
/post-job	Post Job	Employer
/my-jobs	My Jobs	Employer
/employer-applications	Review Applications	Employer
/profile	Profile	Authenticated
/admin	Admin Dashboard	Admin
/companies/:id/reviews	Company Reviews	Public
🔐 Authentication
JWT tokens are stored in localStorage:

access_token – for API requests

refresh_token – for obtaining new access tokens

Auto Token Refresh
The app automatically refreshes expired tokens without user intervention.

📡 API Integration
Base URL Configuration
javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
Request Interceptor
Automatically adds Authorization header:

javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
Response Interceptor
Handles token refresh on 401 errors:

javascript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token and retry
    }
  }
);
🎨 Styling with Tailwind CSS
Color Palette
Color	Usage
Blue	Primary buttons, links
Green	Success messages, apply buttons
Red	Delete, logout, errors
Yellow	Saved jobs star, warnings
Gray	Secondary text, borders
Responsive Design
Mobile: < 768px – stacked layout

Tablet: 768px - 1024px – 2 columns

Desktop: > 1024px – 3-4 columns

🧪 Testing
bash
# Run tests (if configured)
npm test

# Build check
npm run build
🚢 Deployment
Deploy to Netlify
Push code to GitHub

Log in to Netlify

Click "New site from Git"

Connect GitHub repository

Build command: npm run build

Publish directory: dist

Add environment variable: VITE_API_URL=https://your-backend.onrender.com/api

Deploy

Deploy to Vercel
bash
npm install -g vercel
vercel
Build Configuration
json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
🔧 Environment Variables
Variable	Description	Default
VITE_API_URL	Backend API URL	http://localhost:8000/api
📱 Responsive Breakpoints
Breakpoint	Tailwind Class	Devices
< 640px	sm	Mobile
640px - 768px	md	Tablet
768px - 1024px	lg	Small Desktop
> 1024px	xl	Large Desktop
🖼️ Screenshots
Job Listing Page
Search bar with filters

Job cards with title, company, location, salary

Save/unsave buttons (candidate only)

Job Detail Page
Full job description

Requirements and responsibilities

Apply button (candidate only)

Company information

Employer Dashboard
My Jobs list with stats

View applications button

Post new job button

Delete job option

Profile Page
Avatar upload

Personal information

Change password

Notification preferences

Privacy settings

📄 License
MIT License

👨‍💻 Author
Andugetachew

GitHub: @andugetachew

🔗 Related Repositories
Job Board Backend – Django REST API

⭐ Star the Repository
If you find this project useful, please give it a star on GitHub!

Built with ❤️ for the job seeking community
