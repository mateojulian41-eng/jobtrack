import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/" />
        <Route element={<DashboardPage />} path="/dashboard" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;