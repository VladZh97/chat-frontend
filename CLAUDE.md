# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server with Vite
- `npm run build` - Build for production (runs TypeScript check then Vite build)
- `npm run preview` - Preview the production build

### Code Quality
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check code formatting without making changes

## Architecture

This is a React/Preact chat frontend application built with Vite and TypeScript. The app provides a chatbot management platform with authentication, knowledge management, and widget embedding capabilities.

### Key Technologies
- **Framework**: Preact (React-compatible) with Vite
- **Routing**: React Router v7 with lazy loading and nested routes
- **State Management**: Zustand for global state
- **Styling**: TailwindCSS v4 with custom UI components
- **Auth**: Firebase Authentication
- **API**: Axios with automatic Firebase token injection
- **Forms**: React Hook Form with Zod validation
- **Rich Text**: TipTap editor for text editing

### Project Structure
- **API Layer**: `src/api/` - Organized by feature (auth, chatbot, knowledge, etc.)
- **Components**: `src/components/` - Reusable UI components, with `ui/` subfolder for base components
- **Pages**: `src/pages/` - Route-based page components with nested feature folders
- **Dialogs**: `src/dialogs/` - Modal components with their own stores and components
- **Store**: `src/store/` - Zustand stores for global state
- **Types**: `src/types/` - TypeScript type definitions
- **Hooks**: `src/hooks/` - Custom React hooks

### Key Architecture Patterns
- **Route-based code splitting**: Each page is lazy-loaded
- **Protected/Auth routes**: `ProtectedRouteProvider` and `AuthRouteProvider` wrapper components
- **Feature-based organization**: Pages contain their own components, hooks, and constants
- **Dialog system**: Centralized dialog management with dedicated stores
- **API abstraction**: All API calls go through feature-specific modules in `src/api/`

### Authentication Flow
- Firebase Authentication with automatic token refresh
- Protected routes require authentication via `ProtectedRouteProvider`
- Auth routes (login/signup) redirect authenticated users via `AuthRouteProvider`
- API requests automatically include Firebase ID tokens

### State Management
- Zustand for lightweight global state (chatbot, dialogs)
- React Query for server state management
- Local component state for UI-specific state

### Widget System
The app includes an embeddable chat widget at `/widget/:id` that can be integrated into external websites. Widget configuration is managed through the main dashboard.

## Path Alias
Use `@/` prefix for importing from the `src/` directory (configured in vite.config.ts).