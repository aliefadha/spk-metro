# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (be/)
```bash
npm run dev      # Development server with Prisma generation + nodemon
npm start        # Production server with Prisma generation
npm run seed     # Seed database with initial data
npm run reset    # Reset database
node prisma/comprehensive.seed.js  # Run comprehensive seeder with sample data
```

### Frontend (fe/)
```bash
npm run dev      # Vite development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint code checking
```

## Architecture Overview

This is a full-stack KPI management and assessment system with:

**Backend**: Node.js + Express + Prisma ORM + MySQL
- API runs on port 3000
- RESTful API with `/api/v1/` versioning
- JWT authentication with bcrypt password hashing
- Role-based access control (SUPERADMIN, MEMBER, PM)

**Frontend**: React 18 + Vite + Tailwind CSS + Bootstrap
- Modern React with React Router DOM v7
- Axios for API communication with automatic token refresh
- Role-based UI components and protected routes

## Database Schema

The system centers around performance assessment with these key entities:
- **Users**: With roles and division assignments
- **Projects**: With collaborators, status tracking, and completion dates (`tanggal_selesai`)
- **Metrics**: KPIs with targets, weights, and characteristics (Cost/Benefit)
- **Assessments**: Both development project assessments and non-dev assessments
- **Results**: Metric normalization, scoring, and VIKOR analysis
- **Divisions**: Marketing and Developer divisions with member counts

## Key Business Logic

- **KPI Management**: Metrics have targets, weights, and characteristics
- **Assessment System**: Separate flows for development projects vs non-development work
- **VIKOR Analysis**: Multi-criteria decision analysis for performance evaluation
- **Role-Based Access**: Different capabilities for admins, project managers, and members

## File Structure

```
be/
├── bin/www              # Server entry point
├── app.js               # Express app configuration
├── controllers/         # Route handlers
├── middleware/          # Authentication & validation
├── routes/             # API route definitions
├── utils/              # JWT, bcrypt, response utilities
└── prisma/             # Database schema and migrations

fe/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Complete page components
│   ├── layouts/        # Layout components
│   └── utils/          # Auth helpers, axios config
```

## Authentication Flow

- JWT tokens stored in localStorage
- Automatic token refresh on API requests
- Role-based route protection
- Login redirects based on user role

## Development Notes

- Backend uses nodemon for hot reloading
- Frontend uses Vite for fast development
- Database migrations handled by Prisma
- CORS configured to allow all origins
- Environment variables required for database connection and JWT secrets

## Recent Updates & Features

### Database Migrations
- Added `tanggal_selesai` field to project model for completion date tracking
- Migration created: `20250711031013_add_tanggal_selesai_to_project`
- Comprehensive seeder available with sample data from production

### UI/UX Improvements
- **Conditional Table Display**: Tables now hide when no division/selection is made
  - `KPIReportTable.jsx`: Hidden when no project and user selected
  - `TableKPI.jsx`: Hidden when no division selected  
  - `AssesmentTable.jsx`: Hidden when no division selected
- **Enhanced Assessment Table**: 
  - Shows all division members for non-developer divisions
  - Displays members even without assessment data (shows "-")
  - Better empty state handling

### Project Management
- **ProjectTable.jsx**: Added `tanggal_selesai` field support
  - New "Tanggal Selesai" column in project table
  - Date picker input in add/edit forms
  - Optional field with null value support

### Data Seeding
- **Comprehensive Seeder**: `prisma/comprehensive.seed.js`
  - Includes 2 divisions (Marketing, Developer)
  - 11 users with proper password hashing (password: "password")
  - 5 KPI metrics for Developer division
  - 2 completed projects with completion dates
  - 6 project collaborators
  - 10 sample assessments
  - Super Admin: superadmin@gmail.com / password

### Component Architecture
- Better state management for division-based filtering
- Improved error handling and user feedback
- Consistent empty state messaging across components