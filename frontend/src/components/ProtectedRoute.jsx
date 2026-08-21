import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import api from "../services/api";
import { clearSession, getStoredToken } from "../utils/authStorage";

function ProtectedRoute() {
  const token = getStoredToken();
  const [isValidating, setIsValidating] = useState(Boolean(token));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isActive = true;

    api
      .get("/auth/profile")
      .then(() => {
        if (isActive) {
          setIsAuthenticated(true);
          setIsValidating(false);
        }
      })
      .catch(() => {
        if (isActive) {
          clearSession();
          setIsAuthenticated(false);
          setIsValidating(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  if (!token) {
    return <Navigate replace to="/" />;
  }

  if (isValidating) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-5 text-white">
        <section className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#0c1224] p-8 text-center shadow-2xl shadow-black/30">
          <div aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <span className="size-6 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
          </div>
          <h1 className="mt-6 text-xl font-bold">Verificando tu sesión</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Estamos preparando tu espacio de trabajo.</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
