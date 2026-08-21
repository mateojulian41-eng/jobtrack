import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import { useState } from "react";

import api from "../services/api";

function DeleteConfirmationModal({
  application,
  onClose,
  onDeleted,
  onUnauthorized,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!application) {
    return null;
  }

  async function handleDelete() {
    setErrorMessage("");
    setIsDeleting(true);

    try {
      await api.delete(`/applications/${application.id}`);
      onDeleted(application.id);
      onClose();
    } catch (error) {
      if (error.response?.status === 401) {
        onUnauthorized();
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          "No fue posible eliminar la postulación.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div aria-labelledby="delete-application-title" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm" role="dialog">
      <button aria-label="Cerrar confirmación" className="absolute inset-0 cursor-default" onClick={() => !isDeleting && onClose()} type="button" />
      <section className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c1224] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300"><AlertTriangle aria-hidden="true" className="size-6" /></div>
          <button aria-label="Cerrar" className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white" disabled={isDeleting} onClick={onClose} type="button"><X aria-hidden="true" className="size-5" /></button>
        </div>
        <h2 className="mt-6 text-2xl font-bold" id="delete-application-title">Eliminar postulación</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">¿Quieres eliminar la postulación para <strong className="text-slate-200">{application.position}</strong> en <strong className="text-slate-200">{application.company}</strong>? Esta acción no se puede deshacer.</p>
        {errorMessage && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300" role="alert">{errorMessage}</div>}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/5" disabled={isDeleting} onClick={onClose} type="button">Cancelar</button>
          <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60" disabled={isDeleting} onClick={handleDelete} type="button">
            {isDeleting ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> Eliminando...</> : <><Trash2 aria-hidden="true" className="size-4" /> Eliminar</>}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteConfirmationModal;
