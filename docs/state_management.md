# State Management Strategy

This application uses a combination of **React Context** and **TanStack Query (React Query)** for efficient state management.

## 1. Authentication State (Context API)

We use `AuthContext` to manage the global user session state.

-   **Why?**: User data (profile, role) is needed across the entire app (Sidebar, Protected Routes, Navbar).
-   **Implementation**: `frontend/src/context/AuthContext.tsx`
-   **Key Features**:
    -   Persists session via HTTP-only cookies (handled by backend).
    -   Provides `user`, `loading`, `login`, and `logout` methods.
    -   Automatically checks `/api/auth/me` on app load.

## 2. Server State (TanStack Query)

We use React Query for all data fetching, caching, and synchronization with the backend.

-   **Why?**: It handles loading states, error states, caching, and re-fetching automatically, reducing boilerplate.
-   **Implementation**: `frontend/src/lib/api.ts` (Axios client) + `useQuery`/`useMutation` hooks.
-   **Key Features**:
    -   **Caching**: Data like Projects and Blogs are cached to prevent redundant requests.
    -   **Invalidation**: When a new item is created (e.g., `createProject`), we invalidate the `['projects']` query to automatically refetch the list.
    -   **Optimistic Updates**: (Optional) Can be added for immediate UI feedback.

## 3. Form State (React Hook Form + Zod)

We use `react-hook-form` controlled by `zod` schemas for form management.

-   **Why?**: Performance (uncontrolled inputs) and type-safe validation.
-   **Implementation**: All forms in `/dashboard`.
