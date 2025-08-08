import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import CreateClass from "./pages/CreateClass";
import JoinClass from "./pages/JoinClass";
import MyClasses from "./pages/MyClasses";
import CreateAssignment from "./pages/CreateAssignment";
import ClassAssignments from "./pages/ClassAssignments";
import SubmitAssignment from "./pages/SubmitAssignment";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import ViewMySubmission from "./pages/ViewMySubmission";
import ViewClass from "./pages/ViewClass";
import ViewAssignment from "./pages/ViewAssignment";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/sonner";
import TeacherAssignments from "./pages/TeacherAssignments";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        {/* 👨‍🏫 Teacher routes */}
        <Route
          path="/classes/create"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CreateClass />
            </ProtectedRoute>
          }
        />

        {/* 👨‍🎓 Student routes */}
        <Route
          path="/classes/join"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <JoinClass />
            </ProtectedRoute>
          }
        />

        {/* Both roles */}
        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <MyClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/create"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <CreateAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute>
              <ViewClass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/:id"
          element={
            <ProtectedRoute>
              <ViewAssignment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes/:classId/assignments"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClassAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/:assignmentId/submit"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SubmitAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/:assignmentId/submissions"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AssignmentSubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:classId/assignments/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments/:assignmentId/my-submission"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ViewMySubmission />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
