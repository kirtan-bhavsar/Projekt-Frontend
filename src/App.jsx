import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
  

import LoginPage from "./pages/auth/LoginPage.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import PMLayout from "./layouts/PmLayout.jsx";
import DevLayout from "./layouts/DevLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageProjects from "./pages/admin/ManageProjects.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";

import PMDashboard from "./pages/pm/PmDashboard.jsx";
import MyProjects from "./pages/pm/MyProjects.jsx";
import PMTasks from "./pages/pm/PmTasks.jsx";

import DevDashboard from "./pages/dev/DevDashboard.jsx";
import DevTasks from "./pages/dev/DevTasks.jsx";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
      
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        <Route
          path="/pm"
          element={
            <ProtectedRoute allowedRoles={["pm"]}>
              <PMLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PMDashboard />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="tasks" element={<PMTasks />} />
        </Route>

        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DevLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DevDashboard />} />
          <Route path="tasks" element={<DevTasks />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
