import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

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

function NewApplicationModal({
  isOpen,
  onClose,
  onApplicationCreated,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  function updateField(field, value) {
    setFormData((currentData) => {
      if (field === "company") {
        return { ...currentData, company: value };
      }

      if (field === "position") {
        return { ...currentData, position: value };
      }

      if (field === "location") {
        return { ...currentData, location: value };
      }

      if (field === "workMode") {
        return { ...currentData, workMode: value };
      }

      if (field === "source") {
        return { ...currentData, source: value };
      }

      if (field === "applicationDate") {
        return { ...currentData, applicationDate: value };
      }

      if (field === "status") {
        return { ...currentData, status: value };
      }

      if (field === "technologies") {
        return { ...currentData, technologies: value };
      }

      if (field === "jobUrl") {
        return { ...currentData, jobUrl: value };
      }

      return { ...currentData, notes: value };
    });

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setFormData(initialFormData);
    setErrorMessage("");
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const technologies = formData.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    try {
      const response = await api.post("/applications", {
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

      const application = response.data.data.application;

      setFormData(initialFormData);
      onApplicationCreated(application);
      onClose();
    } catch (error) {
      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Company and position are required") {
        setErrorMessage(
          "La empresa y el cargo son obligatorios.",
        );
      } else if (backendMessage === "Invalid application date") {
        setErrorMessage("La fecha seleccionada no es válida.");
      } else {
        setErrorMessage(
          backendMessage ||
            "No fue posible crear la postulación.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      aria-labelledby="new-application-title"
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
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-6"
              />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-blue-400">
                NUEVA OPORTUNIDAD
              </p>

              <h2
                className="mt-1 text-2xl font-bold text-white"
                id="new-application-title"
              >
                Registrar postulación
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Guarda la información principal del proceso.
              </p>
            </div>
          </div>

          <button
            aria-label="Cerrar"
            className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            disabled={isSubmitting}
            onClick={handleClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
          {errorMessage && (
            <div
              className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-company"
              >
                Empresa *
              </label>

              <input
                autoFocus
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-company"
                onChange={(event) =>
                  updateField("company", event.target.value)
                }
                placeholder="Ejemplo: Microsoft"
                required
                type="text"
                value={formData.company}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-position"
              >
                Cargo *
              </label>

              <input
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-position"
                onChange={(event) =>
                  updateField("position", event.target.value)
                }
                placeholder="Ejemplo: Desarrollador Junior"
                required
                type="text"
                value={formData.position}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-location"
              >
                Ubicación
              </label>

              <input
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-location"
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Cartagena, Colombia"
                type="text"
                value={formData.location}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-work-mode"
              >
                Modalidad
              </label>

              <select
                className="h-12 w-full rounded-xl border border-white/10 bg-[#11182b] px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-work-mode"
                onChange={(event) =>
                  updateField("workMode", event.target.value)
                }
                value={formData.workMode}
              >
                <option value="NOT_SPECIFIED">
                  Sin especificar
                </option>
                <option value="REMOTE">Remoto</option>
                <option value="HYBRID">Híbrido</option>
                <option value="ONSITE">Presencial</option>
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-source"
              >
                Fuente
              </label>

              <input
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-source"
                onChange={(event) =>
                  updateField("source", event.target.value)
                }
                placeholder="LinkedIn, Computrabajo..."
                type="text"
                value={formData.source}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-date"
              >
                Fecha de aplicación
              </label>

              <div className="relative">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
                />

                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  id="new-date"
                  onChange={(event) =>
                    updateField(
                      "applicationDate",
                      event.target.value,
                    )
                  }
                  type="date"
                  value={formData.applicationDate}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-status"
              >
                Estado inicial
              </label>

              <select
                className="h-12 w-full rounded-xl border border-white/10 bg-[#11182b] px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-status"
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
                value={formData.status}
              >
                <option value="SAVED">Guardada</option>
                <option value="APPLIED">Aplicada</option>
                <option value="INTERVIEW">Entrevista</option>
                <option value="TECHNICAL_TEST">
                  Prueba técnica
                </option>
                <option value="OFFER">Oferta</option>
                <option value="REJECTED">Rechazada</option>
                <option value="WITHDRAWN">Retirada</option>
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="new-technologies"
              >
                Tecnologías
              </label>

              <input
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                id="new-technologies"
                onChange={(event) =>
                  updateField("technologies", event.target.value)
                }
                placeholder="React, Node.js, PostgreSQL"
                type="text"
                value={formData.technologies}
              />

              <p className="mt-2 text-xs text-slate-600">
                Separa cada tecnología con una coma.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="new-url"
            >
              Enlace de la vacante
            </label>

            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              id="new-url"
              onChange={(event) =>
                updateField("jobUrl", event.target.value)
              }
              placeholder="https://empresa.com/vacante"
              type="url"
              value={formData.jobUrl}
            />
          </div>

          <div className="mt-5">
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="new-notes"
            >
              Notas
            </label>

            <textarea
              className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              id="new-notes"
              onChange={(event) =>
                updateField("notes", event.target.value)
              }
              placeholder="Contacto, próximos pasos o información adicional..."
              value={formData.notes}
            />
          </div>

          <footer className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              className="h-12 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              disabled={isSubmitting}
              onClick={handleClose}
              type="button"
            >
              Cancelar
            </button>

            <button
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <Plus aria-hidden="true" className="size-4" />
                  Crear postulación
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default NewApplicationModal;