import { BriefcaseBusiness } from "lucide-react";

function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

        <BriefcaseBusiness
          aria-hidden="true"
          className="relative size-5 text-white"
          strokeWidth={2.2}
        />
      </div>

      {!compact && (
        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            JobTrack
          </p>

          <p className="text-xs text-slate-500">
            Tu carrera, bajo control
          </p>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;