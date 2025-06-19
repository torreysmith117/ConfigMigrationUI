# Configuration Management Tool - PLEXIS

## Overview

This is a full-stack web application for managing data migration configurations, specifically designed for SSIS (SQL Server Integration Services) workflows in a PLEXIS healthcare system environment. The application allows users to configure, execute, and track database migration operations with a focus on benefit contracts, provider imports, member enrollment, and claims processing.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and database layers:

- **Frontend**: React-based SPA using Vite for development and bundling
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui component library

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database Layer**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints with JSON communication
- **Error Handling**: Centralized error middleware
- **Development**: tsx for TypeScript execution in development

### Database Schema
The application uses two main database tables:

1. **users**: Basic user authentication (id, username, password)
2. **migration_configurations**: Core migration data including:
   - Configuration metadata (file names, server details)
   - Agreement and criteria settings
   - Execution tracking (status, record count, execution time)
   - Audit trail (created timestamps)

## Data Flow

1. **Configuration Creation**: Users fill out migration forms which are validated client-side with Zod schemas
2. **API Processing**: Form data is sent to Express endpoints, validated server-side, and stored in PostgreSQL
3. **Execution Simulation**: The system simulates migration execution with mock processing times and record counts
4. **History Tracking**: All operations are logged with detailed metadata for audit and filtering purposes
5. **Real-time Updates**: TanStack Query manages cache invalidation and real-time data synchronization

## External Dependencies

- **Database**: Neon serverless PostgreSQL for cloud-hosted database
- **UI Components**: Radix UI for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date manipulation utilities

## Deployment Strategy

- **Platform**: Replit with autoscale deployment target
- **Build Process**: 
  - Frontend: Vite builds optimized static assets
  - Backend: esbuild bundles server code with external packages
- **Production Setup**: 
  - Static files served from Express in production
  - Environment-based configuration for development vs production
  - Health check endpoints and logging middleware

The application is designed for rapid development with Replit's integrated environment, featuring automatic builds, PostgreSQL provisioning, and seamless deployment to production.

## Changelog

```
Changelog:
- June 16, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```