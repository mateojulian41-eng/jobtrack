import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronDown,
  ExternalLink,
  Filter,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditApplicationModal from "../components/EditApplicationModal";
import NewApplicationModal from "../components/NewApplicationModal";
import api from "../services/api";

const statusInformation = {
  SAVED: { label: "Guardada", classes: "bg-slate-400/10 text-slate-300" },
  APPLIED: { label: "Aplicada", classes: "bg-blue-400/10 text-blue-300" },
  INTERVIEW: { label: "Entrevista", classes: "bg-amber-400/10 text-amber-300" },
  TECHNICAL_TEST: { label: "Prueba técnica", classes: "bg-violet-400/10 text-violet-300" },
  OFFER: { label: "Oferta", classes: "bg-emerald-400/10 text-emerald-300" },
  REJECTED: { label: "Rechazada", classes: "bg-red-400/10 text-red-300" },
  WITHDRAWN: { label: "Retirada", classes: "bg-slate-500/10 text-slate-500" },
};

const workModeLabels = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ONSITE: "Presencial",
  NOT_SPECIFIED: "Sin especificar",
};

const statusOptions = Object.entries(statusInformation);
const workModeOptions = Object.entries(workModeLabels);

function getStoredUser() {
  const storedUser = localStorage.getItem("jobtrack_user") || sessionStorage.getItem("jobtrack_user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function clearSession() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem("jobtrack_token");
    storage.removeItem("jobtrack_user");
  });
}

function formatDate(date) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

function ApplicationsPage() {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [deletingApplication, setDeletingApplication] = useState(null);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  function handleUnauthorized() {
    clearSession();
    navigate("/");
  }

  useEffect(() => {
    async function loadApplications() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await api.get("/applications");
        setApplications(response.data.data.applications);
      } catch (error) {
        if (error.response?.status === 401) {
          clearSession();
          navigate("/");
          return;
        }
        setErrorMessage(error.response?.data?.message || "No fue posible cargar tus postulaciones.");
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, [navigate]);

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  function handleApplicationCreated(application) {
    setApplications((currentApplications) => [application, ...currentApplications]);
  }

  function handleApplicationUpdated(updatedApplication) {
    setApplications((currentApplications) => currentApplications.map((application) => application.id === updatedApplication.id ? updatedApplication : application));
  }

  async function handleStatusChange(application, nextStatus) {
    if (nextStatus === application.status) return;
    setChangingStatusId(application.id);
    setErrorMessage("");
    setApplications((currentApplications) => currentApplications.map((item) => item.id === application.id ? { ...item, status: nextStatus } : item));

    try {
      const response = await api.patch(`/applications/${application.id}`, { status: nextStatus });
      const updatedApplication = response.data.data.application;
      setApplications((currentApplications) => currentApplications.map((item) => item.id === updatedApplication.id ? updatedApplication : item));
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      setApplications((currentApplications) => currentApplications.map((item) => item.id === application.id ? application : item));
      setErrorMessage(error.response?.data?.message || "No fue posible actualizar el estado.");
    } finally {
      setChangingStatusId(null);
    }
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredApplications = applications.filter((application) => {
    const matchesSearch = !normalizedSearch || [application.company, application.position].some((value) => value?.toLowerCase().includes(normalizedSearch));
    return matchesSearch && (!statusFilter || application.status === statusFilter) && (!workModeFilter || application.workMode === workModeFilter);
  });
  const hasFilters = Boolean(search || statusFilter || workModeFilter);
  const firstName = user?.name?.split(" ")[0] || "usuario";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-white">
      {isSidebarOpen && <button aria-label="Cerrar menú" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setIsSidebarOpen(false)} type="button" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-[#080d1c] px-5 py-6 transition-transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <BrandLogo />
          <button aria-label="Cerrar menú" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden" onClick={() => setIsSidebarOpen(false)} type="button"><X aria-hidden="true" className="size-5" /></button>
        </div>
        <nav className="mt-10 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white" onClick={() => navigate("/dashboard")} type="button"><LayoutDashboard aria-hidden="true" className="size-5" />Dashboard</button>
          <button aria-current="page" className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-blue-600/15" type="button"><BriefcaseBusiness aria-hidden="true" className="size-5" />Postulaciones</button>
        </nav>
        <div className="mt-auto">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="truncate text-sm font-semibold">{user?.name || "Usuario JobTrack"}</p><p className="mt-1 truncate text-xs text-slate-500">{user?.email || "Sin correo"}</p></div>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/10" onClick={handleLogout} type="button"><LogOut aria-hidden="true" className="size-5" />Cerrar sesión</button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050816]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center gap-4">
            <button aria-label="Abrir menú" className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-300 lg:hidden" onClick={() => setIsSidebarOpen(true)} type="button"><Menu aria-hidden="true" className="size-5" /></button>
            <div className="relative hidden max-w-lg flex-1 md:block"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input aria-label="Buscar por empresa o cargo" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por empresa o cargo..." type="search" value={search} /></div>
            <div className="ml-auto"><button className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500" onClick={() => setIsNewOpen(true)} type="button"><Plus aria-hidden="true" className="size-4" /><span className="hidden sm:inline">Nueva postulación</span></button></div>
          </div>
        </header>

        <main className="px-5 py-8 sm:px-8"><div className="mx-auto max-w-[1500px]">
          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-400">GESTIÓN PROFESIONAL</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mis postulaciones</h1><p className="mt-3 text-slate-400">Hola, {firstName}. Organiza cada oportunidad de tu búsqueda.</p></div><p className="text-sm text-slate-500">{filteredApplications.length} de {applications.length} resultados</p></section>
          {errorMessage && <div className="mt-7 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300" role="alert"><span className="flex-1">{errorMessage}</span><button aria-label="Reintentar carga" className="rounded-lg p-1 hover:bg-red-400/10" onClick={() => window.location.reload()} type="button"><RefreshCw aria-hidden="true" className="size-4" /></button></div>}

          <section className="mt-8 rounded-2xl border border-white/10 bg-[#0c1224] p-4 sm:p-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative flex-1 md:hidden"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input aria-label="Buscar por empresa o cargo" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por empresa o cargo..." type="search" value={search} /></div><div className="flex items-center gap-2 text-sm font-semibold text-slate-300"><Filter aria-hidden="true" className="size-4 text-blue-400" />Filtros</div><div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-2"><FilterSelect ariaLabel="Filtrar por estado" onChange={setStatusFilter} options={statusOptions} value={statusFilter} emptyLabel="Todos los estados" /><FilterSelect ariaLabel="Filtrar por modalidad" onChange={setWorkModeFilter} options={workModeOptions} value={workModeFilter} emptyLabel="Todas las modalidades" /></div>{hasFilters && <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white" onClick={() => { setSearch(""); setStatusFilter(""); setWorkModeFilter(""); }} type="button"><X aria-hidden="true" className="size-4" />Limpiar</button>}</div></section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1224]">
            {isLoading && <div className="flex flex-col items-center gap-3 p-14 text-sm text-slate-500"><LoaderCircle aria-hidden="true" className="size-7 animate-spin text-blue-400" />Cargando postulaciones...</div>}
            {!isLoading && filteredApplications.length === 0 && <div className="p-14 text-center"><BriefcaseBusiness aria-hidden="true" className="mx-auto size-10 text-slate-700" /><p className="mt-4 font-semibold text-slate-300">{hasFilters ? "No hay resultados con estos filtros" : "Aún no tienes postulaciones"}</p><p className="mt-2 text-sm text-slate-500">{hasFilters ? "Prueba con otra combinación de búsqueda." : "Registra tu primera oportunidad para comenzar."}</p>{!hasFilters && <button className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold hover:bg-blue-500" onClick={() => setIsNewOpen(true)} type="button"><Plus aria-hidden="true" className="size-4" />Nueva postulación</button>}</div>}
            {!isLoading && filteredApplications.length > 0 && <div className="divide-y divide-white/5">{filteredApplications.map((application) => <ApplicationRow application={application} changingStatusId={changingStatusId} key={application.id} onDelete={() => setDeletingApplication(application)} onEdit={() => setEditingApplication(application)} onStatusChange={handleStatusChange} />)}</div>}
          </section>
        </div></main>
      </div>

      <NewApplicationModal isOpen={isNewOpen} onApplicationCreated={handleApplicationCreated} onClose={() => setIsNewOpen(false)} />
      <EditApplicationModal application={editingApplication} key={editingApplication?.id || "edit-modal"} onApplicationUpdated={handleApplicationUpdated} onClose={() => setEditingApplication(null)} onUnauthorized={handleUnauthorized} />
      <DeleteConfirmationModal application={deletingApplication} onClose={() => setDeletingApplication(null)} onDeleted={(id) => setApplications((currentApplications) => currentApplications.filter((application) => application.id !== id))} onUnauthorized={handleUnauthorized} />
    </div>
  );
}

function FilterSelect({ ariaLabel, emptyLabel, onChange, options, value }) {
  return <div className="relative"><select aria-label={ariaLabel} className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#11182b] px-4 pr-10 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" onChange={(event) => onChange(event.target.value)} value={value}><option value="">{emptyLabel}</option>{options.map(([optionValue, labelOrInfo]) => <option key={optionValue} value={optionValue}>{labelOrInfo.label || labelOrInfo}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" /></div>;
}

function ApplicationRow({ application, changingStatusId, onDelete, onEdit, onStatusChange }) {
  const status = statusInformation[application.status] || statusInformation.SAVED;
  return <article className="flex flex-col gap-5 p-5 transition hover:bg-white/[0.025] sm:p-6 xl:flex-row xl:items-center">
    <div className="flex min-w-0 flex-1 items-start gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"><BriefcaseBusiness aria-hidden="true" className="size-5 text-blue-400" /></div><div className="min-w-0"><h2 className="truncate font-semibold text-white">{application.position}</h2><p className="mt-1 truncate text-sm text-slate-400">{application.company}{application.location ? ` · ${application.location}` : ""}</p><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{workModeLabels[application.workMode] || "Sin especificar"}</span><span className="text-slate-700">•</span><span>{application.source || "Fuente no especificada"}</span><span className="text-slate-700">•</span><span>{formatDate(application.applicationDate)}</span></div>{application.technologies?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{application.technologies.map((technology) => <span className="rounded-md bg-blue-400/10 px-2 py-1 text-xs text-blue-300" key={technology}>{technology}</span>)}</div>}</div></div>
    <div className="flex flex-wrap items-center gap-3 xl:justify-end"><div className="relative"><select aria-label={`Cambiar estado de ${application.position}`} className={`h-9 appearance-none rounded-full border-0 py-1 pl-3 pr-8 text-xs font-semibold outline-none ring-1 ring-inset ring-white/5 ${status.classes}`} disabled={changingStatusId === application.id} onChange={(event) => onStatusChange(application, event.target.value)} value={application.status}>{statusOptions.map(([value, info]) => <option className="bg-[#11182b] text-white" key={value} value={value}>{info.label}</option>)}</select>{changingStatusId === application.id ? <LoaderCircle aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 animate-spin" /> : <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2" />}</div><div className="flex items-center gap-1 border-l border-white/10 pl-3"><button aria-label={`Editar ${application.position}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-400/10 hover:text-blue-300" onClick={onEdit} title="Editar" type="button"><Pencil aria-hidden="true" className="size-4" /></button>{application.jobUrl && <a aria-label={`Abrir enlace de ${application.position}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white" href={application.jobUrl} rel="noreferrer noopener" target="_blank" title="Abrir enlace"><ExternalLink aria-hidden="true" className="size-4" /></a>}<button aria-label={`Eliminar ${application.position}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-400/10 hover:text-red-300" onClick={onDelete} title="Eliminar" type="button"><Trash2 aria-hidden="true" className="size-4" /></button></div></div>
  </article>;
}

export default ApplicationsPage;
