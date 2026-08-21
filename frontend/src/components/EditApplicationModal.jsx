import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, LoaderCircle, Save, X } from "lucide-react";

import api from "../services/api";

const initialFormData = {
  company: "",
  position: "",
  location: "",
  workMode: "NOT_SPECIFIED",
  source: "",
  applicationDate: "",
  status: "SAVED",
  technologies: "",
  jobUrl: "",
  notes: "",
};

const inputClasses = "h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const statusOptions = [
  ["SAVED", "Guardada"],
  ["APPLIED", "Aplicada"],
  ["INTERVIEW", "Entrevista"],
  ["TECHNICAL_TEST", "Prueba técnica"],
  ["OFFER", "Oferta"],
  ["REJECTED", "Rechazada"],
  ["WITHDRAWN", "Retirada"],
];

function getDateValue(date) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function getFormData(application) {
  if (!application) {
    return initialFormData;
  }

  return {
    company: application.company || "",
    position: application.position || "",
    location: application.location || "",
    workMode: application.workMode || "NOT_SPECIFIED",
    source: application.source || "",
    applicationDate: getDateValue(application.applicationDate),
    status: application.status || "SAVED",
    technologies: Array.isArray(application.technologies)
      ? application.technologies.join(", ")
      : "",
    jobUrl: application.jobUrl || "",
    notes: application.notes || "",
  };
}

function EditApplicationModal({
  application,
  onApplicationUpdated,
  onClose,
  onUnauthorized,
}) {
  const [formData, setFormData] = useState(() => getFormData(application));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    if (application) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [application, isSubmitting, onClose]);

  if (!application) {
    return null;
  }

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
    setErrorMessage("");
  }

  function handleClose() {
    if (!isSubmitting) {
      onClose();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!formData.company.trim() || !formData.position.trim()) {
      setErrorMessage("La empresa y el cargo no pueden estar vacíos.");
      return;
    }

    setIsSubmitting(true);
    const technologies = formData.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    try {
      const response = await api.patch(`/applications/${application.id}`, {
        company: formData.company.trim(),
        position: formData.position.trim(),
        location: formData.location.trim() || null,
        workMode: formData.workMode,
        source: formData.source.trim() || null,
        applicationDate: formData.applicationDate || null,
        status: formData.status,
        technologies,
        jobUrl: formData.jobUrl.trim() || null,
        notes: formData.notes.trim() || null,
      });

      onApplicationUpdated(response.data.data.application);
      onClose();
    } catch (error) {
      if (error.response?.status === 401) {
        onUnauthorized();
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "No fue posible actualizar la postulación.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      aria-labelledby="edit-application-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Cerrar formulario"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        type="button"
      />

      <section className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#0c1224] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-[#0c1224]/95 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <BriefcaseBusiness aria-hidden="true" className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-blue-400">EDITAR POSTULACIÓN</p>
              <h2 className="mt-1 text-2xl font-bold text-white" id="edit-application-title">Actualizar proceso</h2>
            </div>
          </div>
          <button aria-label="Cerrar" className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white" disabled={isSubmitting} onClick={handleClose} type="button">
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <form aria-busy={isSubmitting} className="p-6 sm:p-8" onSubmit={handleSubmit}>
          {errorMessage && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300" role="alert">{errorMessage}</div>}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Empresa *" id="edit-company"><input required className={inputClasses} id="edit-company" onChange={(event) => updateField("company", event.target.value)} value={formData.company} /></Field>
            <Field label="Cargo *" id="edit-position"><input required className={inputClasses} id="edit-position" onChange={(event) => updateField("position", event.target.value)} value={formData.position} /></Field>
            <Field label="Ubicación" id="edit-location"><input className={inputClasses} id="edit-location" onChange={(event) => updateField("location", event.target.value)} value={formData.location} /></Field>
            <Field label="Modalidad" id="edit-work-mode"><select className={`${inputClasses} bg-[#11182b]`} id="edit-work-mode" onChange={(event) => updateField("workMode", event.target.value)} value={formData.workMode}><option value="NOT_SPECIFIED">Sin especificar</option><option value="REMOTE">Remoto</option><option value="HYBRID">Híbrido</option><option value="ONSITE">Presencial</option></select></Field>
            <Field label="Fuente" id="edit-source"><input className={inputClasses} id="edit-source" onChange={(event) => updateField("source", event.target.value)} value={formData.source} /></Field>
            <Field label="Fecha de aplicación" id="edit-date"><div className="relative"><CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input className={`${inputClasses} pl-12`} id="edit-date" onChange={(event) => updateField("applicationDate", event.target.value)} type="date" value={formData.applicationDate} /></div></Field>
            <Field label="Estado" id="edit-status"><select className={`${inputClasses} bg-[#11182b]`} id="edit-status" onChange={(event) => updateField("status", event.target.value)} value={formData.status}>{statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="Tecnologías" id="edit-technologies"><input className={inputClasses} id="edit-technologies" onChange={(event) => updateField("technologies", event.target.value)} placeholder="React, Node.js, PostgreSQL" value={formData.technologies} /></Field>
          </div>

          <Field className="mt-5" label="Enlace de la vacante" id="edit-url"><input className={inputClasses} id="edit-url" onChange={(event) => updateField("jobUrl", event.target.value)} type="url" value={formData.jobUrl} /></Field>
          <Field className="mt-5" label="Notas" id="edit-notes"><textarea className={`${inputClasses} min-h-28 resize-y py-3`} id="edit-notes" onChange={(event) => updateField("notes", event.target.value)} value={formData.notes} /></Field>

          <footer className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button className="h-12 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/5" disabled={isSubmitting} onClick={handleClose} type="button">Cancelar</button>
            <button aria-busy={isSubmitting} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
              {isSubmitting ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> Guardando...</> : <><Save aria-hidden="true" className="size-4" /> Guardar cambios</>}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function Field({ children, className = "", id, label }) {
  return <div className={className}><label className="mb-2 block text-sm font-medium text-slate-200" htmlFor={id}>{label}</label>{children}</div>;
}

export default EditApplicationModal;
