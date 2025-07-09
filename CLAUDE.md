# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (be/)
```bash
npm run dev      # Development server with Prisma generation + nodemon
npm start        # Production server with Prisma generation
npm run seed     # Seed database with initial data
npm run reset    # Reset database
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
- **Projects**: With collaborators and status tracking
- **Metrics**: KPIs with targets, weights, and characteristics (Cost/Benefit)
- **Assessments**: Both development project assessments and non-dev assessments
- **Results**: Metric normalization, scoring, and VIKOR analysis

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