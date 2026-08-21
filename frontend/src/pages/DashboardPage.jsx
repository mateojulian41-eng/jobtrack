import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Target,
  TestTube2,
  UsersRound,
  X,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import NewApplicationModal from "../components/NewApplicationModal";
import api from "../services/api";

const initialStats = {
  total: 0,
  saved: 0,
  applied: 0,
  interview: 0,
  technicalTest: 0,
  offer: 0,
  rejected: 0,
  withdrawn: 0,
};

const statusInformation = {
  SAVED: {
    label: "Guardada",
    classes: "bg-slate-400/10 text-slate-300",
  },
  APPLIED: {
    label: "Aplicada",
    classes: "bg-blue-400/10 text-blue-300",
  },
  INTERVIEW: {
    label: "Entrevista",
    classes: "bg-amber-400/10 text-amber-300",
  },
  TECHNICAL_TEST: {
    label: "Prueba técnica",
    classes: "bg-violet-400/10 text-violet-300",
  },
  OFFER: {
    label: "Oferta",
    classes: "bg-emerald-400/10 text-emerald-300",
  },
  REJECTED: {
    label: "Rechazada",
    classes: "bg-red-400/10 text-red-300",
  },
  WITHDRAWN: {
    label: "Retirada",
    classes: "bg-slate-400/10 text-slate-400",
  },
};

const workModeLabels = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ONSITE: "Presencial",
  NOT_SPECIFIED: "Sin especificar",
};

function getStoredUser() {
  const storedUser =
    localStorage.getItem("jobtrack_user") ||
    sessionStorage.getItem("jobtrack_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("jobtrack_token");
  localStorage.removeItem("jobtrack_user");
  sessionStorage.removeItem("jobtrack_token");
  sessionStorage.removeItem("jobtrack_user");
}

function formatDate(date) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function DashboardPage() {
  const navigate = useNavigate();

  const [user] = useState(getStoredUser);
  const [stats, setStats] = useState(initialStats);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewApplicationOpen, setIsNewApplicationOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [statsResponse, applicationsResponse] =
          await Promise.all([
            api.get("/applications/stats"),
            api.get("/applications"),
          ]);

        setStats(statsResponse.data.data.stats);
        setApplications(
          applicationsResponse.data.data.applications,
        );
      } catch (error) {
        if (error.response?.status === 401) {
          clearSession();
          navigate("/");
          return;
        }

        setErrorMessage(
          error.response?.data?.message ||
            "No fue posible cargar el dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  async function handleApplicationCreated(application) {
    setApplications((currentApplications) => [
      application,
      ...currentApplications,
    ]);

    try {
      const statsResponse = await api.get("/applications/stats");
      setStats(statsResponse.data.data.stats);
    } catch {
      setErrorMessage(
        "La postulación fue creada, pero las estadísticas no pudieron actualizarse.",
      );
    }
  }

  const firstName = user?.name?.split(" ")[0] || "usuario";
  const normalizedSearch = search.trim().toLowerCase();

  const filteredApplications = applications
    .filter((application) => {
      if (!normalizedSearch) {
        return true;
      }

      const company = application.company?.toLowerCase() || "";
      const position = application.position?.toLowerCase() || "";

      return (
        company.includes(normalizedSearch) ||
        position.includes(normalizedSearch)
      );
    })
    .slice(0, 5);

  const responseRate =
    stats.total > 0
      ? Math.round(
          ((stats.interview +
            stats.technicalTest +
            stats.offer) /
            stats.total) *
            100,
        )
      : 0;

  const summaryCards = [
    {
      title: "Postulaciones",
      value: stats.total,
      description: "Procesos registrados",
      icon: ClipboardList,
      color: "bg-blue-400/10 text-blue-400",
    },
    {
      title: "Entrevistas",
      value: stats.interview,
      description: "Procesos activos",
      icon: UsersRound,
      color: "bg-amber-400/10 text-amber-400",
    },
    {
      title: "Pruebas técnicas",
      value: stats.technicalTest,
      description: "Evaluaciones",
      icon: TestTube2,
      color: "bg-violet-400/10 text-violet-400",
    },
    {
      title: "Tasa de respuesta",
      value: `${responseRate}%`,
      description: "Avance general",
      icon: Target,
      color: "bg-emerald-400/10 text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {isSidebarOpen && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-[#080d1c] px-5 py-6 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <BrandLogo />

          <button
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          <button
            className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-blue-600/15"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <LayoutDashboard
              aria-hidden="true"
              className="size-5"
            />
            Dashboard
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            onClick={() => navigate("/applications")}
            type="button"
          >
            <BriefcaseBusiness
              aria-hidden="true"
              className="size-5"
            />
            Postulaciones
          </button>
        </nav>

        <div className="mt-auto">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="truncate text-sm font-semibold">
              {user?.name || "Usuario JobTrack"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user?.email || "Sin correo"}
            </p>
          </div>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
            onClick={handleLogout}
            type="button"
          >
            <LogOut aria-hidden="true" className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050816]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center gap-4">
            <button
              aria-label="Abrir menú"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-300 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>

            <div className="relative hidden max-w-lg flex-1 md:block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
              />

              <input
                aria-label="Buscar postulaciones"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por empresa o cargo..."
                type="search"
                value={search}
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                aria-busy={isNewApplicationOpen}
                onClick={() => setIsNewApplicationOpen(true)}
                type="button"
              >
                <Plus aria-hidden="true" className="size-4" />

                <span className="hidden sm:inline">
                  Nueva postulación
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-[1500px]">
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-400">
                  PANEL GENERAL
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Hola, {firstName}
                </h1>

                <p className="mt-3 text-slate-400">
                  Este es el panorama actual de tu búsqueda laboral.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays
                  aria-hidden="true"
                  className="size-4"
                />

                Datos actualizados en tiempo real
              </div>
            </section>

            {errorMessage && (
              <div
                className="mt-7 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(
                ({
                  title,
                  value,
                  description,
                  icon: Icon,
                  color,
                }) => (
                  <article
                    className="rounded-2xl border border-white/10 bg-[#0c1224] p-5 shadow-xl shadow-black/10"
                    key={title}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          {title}
                        </p>

                        <p className="mt-3 text-3xl font-bold">
                          {isLoading ? "..." : value}
                        </p>
                      </div>

                      <div
                        className={`flex size-11 items-center justify-center rounded-xl ${color}`}
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      {description}
                    </p>
                  </article>
                ),
              )}
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1224]">
              <div className="border-b border-white/5 px-5 py-5 sm:px-6">
                <h2 className="font-bold">
                  Postulaciones recientes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tus últimas oportunidades registradas
                </p>
              </div>

              <div aria-busy={isLoading} className="divide-y divide-white/5">
                {isLoading && (
                  <p className="p-8 text-center text-sm text-slate-500">
                    Cargando postulaciones...
                  </p>
                )}

                {!isLoading &&
                  filteredApplications.map((application) => {
                    const status =
                      statusInformation[application.status] ||
                      statusInformation.SAVED;

                    return (
                      <article
                        className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:px-6"
                        key={application.id}
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                          <BriefcaseBusiness
                            aria-hidden="true"
                            className="size-5 text-blue-400"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">
                            {application.position}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {application.company} ·{" "}
                            {workModeLabels[application.workMode] ||
                              "Sin especificar"}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}
                          >
                            {status.label}
                          </span>

                          <p className="mt-2 text-xs text-slate-600">
                            {formatDate(
                              application.applicationDate ||
                                application.createdAt,
                            )}
                          </p>
                        </div>
                      </article>
                    );
                  })}

                {!isLoading &&
                  filteredApplications.length === 0 && (
                    <div className="p-10 text-center">
                      <BriefcaseBusiness
                        aria-hidden="true"
                        className="mx-auto size-9 text-slate-700"
                      />

                      <p className="mt-4 font-semibold text-slate-300">
                        No encontramos postulaciones
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Registra una oportunidad para comenzar.
                      </p>
                    </div>
                  )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <NewApplicationModal
        isOpen={isNewApplicationOpen}
        onApplicationCreated={handleApplicationCreated}
        onClose={() => setIsNewApplicationOpen(false)}
      />
    </div>
  );
}

export default DashboardPage;