# Google Classroom Clone - Client

This is the client-side application for a feature-rich clone of Google Classroom. It provides a modern, responsive, and user-friendly interface for teachers and students to manage their educational activities. The application is built with a modern tech stack including React, Vite, TypeScript, and Tailwind CSS.

## ✨ Features

- **User Authentication**: Secure registration and login functionality.
- **Role-Based Access**: Distinct interfaces and permissions for **Teachers** and **Students**.
- **Class Management**:
  - **Teachers**: Can create new classes, each with a unique join code.
  - **Students**: Can join existing classes using a class code.
- **Assignment Workflow**:
  - **Teachers**: Can create, view, and manage assignments for their classes. They can also view and grade all student submissions for an assignment.
  - **Students**: Can view assignments for their joined classes, submit their work, and view their graded submissions.
- **Dashboard**: A central hub providing users with an overview of their classes, assignments, and other relevant statistics.
- **Responsive Design**: A mobile-first design that works seamlessly across devices.
- **Theming**: Switch between light and dark modes for user comfort.
- **Toast Notifications**: Provides non-intrusive feedback for user actions.

## 🚀 Tech Stack

This project leverages a modern and powerful set of technologies:

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a [shadcn/ui](https://ui.shadcn.com/) component library.
- **Routing**: [React Router](https://reactrouter.com/)
- **Server State Management**: [TanStack Query](https://tanstack.com/query/latest) for efficient data fetching, caching, and synchronization.
- **Client State Management**: React Context API for authentication state.
- **Forms**: [React Hook Form](https://react-hook-form.com/) for performant form handling.
- **Schema Validation**: [Zod](https://zod.dev/) for type-safe validation.
- **API Client**: [Axios](https://axios-http.com/) with interceptors for automated token refresh.
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (as specified in `package.json`)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/google-classroom-clone.git
    cd google-classroom-clone/client
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the `client` directory and add the following variable. This points to the backend server API.
    ```env
    # .env
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```

4.  **Run the development server:**
    ```sh
    pnpm run dev
    ```
    The application should now be running on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## 📜 Available Scripts

In the project directory, you can run:

- `pnpm run dev`: Runs the app in development mode.
- `pnpm run build`: Builds the app for production to the `dist` folder.
- `pnpm run lint`: Lints the codebase using ESLint to find and fix problems.
- `pnpm run preview`: Serves the production build locally to preview it.

## 📁 Project Structure

The `src` directory is organized to be scalable and maintainable:

```
src/
├── api/          # Axios instance and interceptor configuration.
├── assets/       # Static assets like images and SVGs.
├── components/   # Reusable UI components (e.g., Navbar, Buttons, Cards).
├── context/      # React context providers (e.g., AuthContext).
├── hooks/        # Custom hooks, including TanStack Query hooks.
├── lib/          # Shared utilities, type definitions, and validation schemas.
├── pages/        # Top-level page components for each route.
├── routes/       # Routing configuration, including protected routes.
└── main.tsx      # The main entry point of the application.
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
