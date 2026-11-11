import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminRoute from "./AdminRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Sitio público */}
          <Route path="/" element={<LandingPage />} />

          {/* Inicio de sesión administrativo */}
          <Route path="/login" element={<LoginPage />} />

          {/* Panel de Administración exclusivo para rol 'admin' */}
          <Route element={<AdminRoute />}>
            <Route path="/adminetronic" element={<AdminDashboardPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
