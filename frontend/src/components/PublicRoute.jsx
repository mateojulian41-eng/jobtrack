import { Navigate, Outlet } from "react-router-dom";

import { getStoredToken } from "../utils/authStorage";

function PublicRoute() {
  if (getStoredToken()) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default PublicRoute;
