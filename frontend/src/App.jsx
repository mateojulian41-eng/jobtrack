import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getStoredToken } from "./utils/authStorage";

function SessionRedirect() {
  return getStoredToken() ? (
    <Navigate replace to="/dashboard" />
  ) : (
    <Navigate replace to="/" />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<LoginPage />} path="/" />
          <Route element={<RegisterPage />} path="/register" />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<ApplicationsPage />} path="/applications" />
        </Route>
        <Route element={<SessionRedirect />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;