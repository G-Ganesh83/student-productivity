import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Productivity from "./pages/Productivity";
import Collaboration from "./pages/Collaboration";
import Room from "./pages/Room";
import Resources from "./pages/Resources";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Landing />} />
        </Route>
        
        {/* App Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="resources" element={<Resources />} />
        </Route>
        
        {/* Room Route (without AppLayout sidebar) */}
        <Route path="/room/:roomId" element={<Room />} />
        
        {/* Redirect root to landing if not authenticated */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
