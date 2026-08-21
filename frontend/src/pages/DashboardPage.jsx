import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BrandLogo from "../components/BrandLogo";

function DashboardPage() {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("jobtrack_user") ||
    sessionStorage.getItem("jobtrack_user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("jobtrack_token");
    localStorage.removeItem("jobtrack_user");
    sessionStorage.removeItem("jobtrack_token");
    sessionStorage.removeItem("jobtrack_user");

    navigate("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-5 text-white">
      <section className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0c1224] p-8 text-center shadow-2xl">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        <div className="mx-auto mt-10 flex size-16 items-center justify-center rounded-2xl bg-emerald-400/10">
          <CheckCircle2
            aria-hidden="true"
            className="size-8 text-emerald-400"
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-blue-400">
          SESIÓN INICIADA
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Bienvenido, {user?.name || "usuario"}
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          El inicio de sesión funciona correctamente. Aquí construiremos el
          dashboard con tus estadísticas y postulaciones reales.
        </p>

        <button
          className="mx-auto mt-8 flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 font-semibold text-slate-200 transition hover:bg-white/[0.08]"
          onClick={handleLogout}
          type="button"
        >
          Cerrar sesión
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </section>
    </main>
  );
}

export default DashboardPage;