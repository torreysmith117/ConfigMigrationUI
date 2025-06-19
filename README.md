# ConfigMigrationUI

**ConfigMigrationUI** is a full-stack TypeScript-based web application for managing SSIS-powered configuration set migrations in healthcare environments. The application provides a clean, modular interface for planning, executing, and tracking configuration workflows—particularly those tied to SQL Server Integration Services (SSIS) packages and healthcare data transformation pipelines.

---

## Features

- Modern UI built with React, TailwindCSS, and shadcn/ui
- Configuration Execution form that triggers SSIS packages via backend API
- Import/Export functionality for managing configuration snapshots
- Historical tracking interface for all migrations
- Modular structure with reusable components and hooks
- Integrated testing environment using Vitest
- Backend service using Express and PostgreSQL with Drizzle ORM

---

## Project Structure

### Root Configuration Files

- `package.json` – Node.js dependencies and scripts
- `tsconfig.json` – TypeScript compiler options
- `vite.config.ts`, `vitest.config.ts` – Build and testing configurations
- `drizzle.config.ts` – Database ORM configuration
- `tailwind.config.ts`, `postcss.config.js` – Styling and CSS processing
- `components.json` – UI component configuration
- `replit.md` – Replit environment documentation (if applicable)

### Frontend (`/client`)

- `index.html`, `main.tsx`, `App.tsx` – Application entry points and routing
- `components/` – UI layer, including:
  - Navigation bar
  - SSIS configuration form
  - Migration history table
- `pages/` – Route-based views (export, import, history, 404)
- `hooks/` – Custom logic for migration execution, toasts, and responsiveness
- `lib/` – Shared types, mock data, utility functions, API query setup

### Backend (`/server`)

- `index.ts` – Express server entry point
- `routes.ts` – REST API routes for migration execution
- `storage.ts`, `db.ts` – PostgreSQL integration
- `vite.ts` – Development tooling integration

### Shared Module

- `shared/schema.ts` – Shared database schema and validation logic

### Testing (`/test`)

- `setup.ts` – Test environment initialization
- `components/`, `hooks/`, `utils/` – Unit tests for UI and logic

---

## Architecture Overview

**Frontend Flow**:  
`main.tsx` → `App.tsx` → `pages/` → `components/` → `hooks/` → `lib/`

**Backend Flow**:  
`index.ts` → `routes.ts` → `storage.ts` → `db.ts` → PostgreSQL

**Data Execution Flow**:  
Client Form → API Endpoint → Storage Layer → Database → SSIS Package Trigger

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/torreysmith117/ConfigMigrationUI.git
   cd ConfigMigrationUI
