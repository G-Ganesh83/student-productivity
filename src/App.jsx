import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded page components for route-based code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Focus = lazy(() => import("./pages/Focus"));
const Productivity = lazy(() => import("./pages/Productivity"));
const Collaboration = lazy(() => import("./pages/Collaboration"));
const Room = lazy(() => import("./pages/Room"));
const Resources = lazy(() => import("./pages/Resources"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* App Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productivity" element={<Productivity />} />
            <Route path="collaboration" element={<Collaboration />} />
            <Route path="resources" element={<Resources />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Room Route (without AppLayout sidebar) */}
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />

          {/* Focus Mode Route (without AppLayout sidebar) */}
          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <Focus />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to landing if not authenticated */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
