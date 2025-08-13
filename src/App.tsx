import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreateClass = lazy(() => import("./pages/CreateClass"));
const JoinClass = lazy(() => import("./pages/JoinClass"));
const MyClasses = lazy(() => import("./pages/MyClasses"));
const CreateAssignment = lazy(() => import("./pages/CreateAssignment"));
const ClassAssignments = lazy(() => import("./pages/ClassAssignments"));
const SubmitAssignment = lazy(() => import("./pages/SubmitAssignment"));
const AssignmentSubmissions = lazy(() => import("./pages/AssignmentSubmissions"));
const ViewMySubmission = lazy(() => import("./pages/ViewMySubmission"));
const ViewClass = lazy(() => import("./pages/ViewClass"));
const ViewAssignment = lazy(() => import("./pages/ViewAssignment"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
import { Toaster } from "./components/ui/sonner";
import TeacherAssignments from "./pages/TeacherAssignments";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loading } from "./components/Loading";
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <main id="main-content">
        <Suspense fallback={<Loading message="Loading..." fullScreen />}>        
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
        {/* 404 Not Found route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </main>
      <Toaster />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
