import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Productivity from "./pages/Productivity";
import Collaboration from "./pages/Collaboration";
import Room from "./pages/Room";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
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
        
        {/* Redirect root to landing if not authenticated */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
