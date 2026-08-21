import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<ApplicationsPage />} path="/applications" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;