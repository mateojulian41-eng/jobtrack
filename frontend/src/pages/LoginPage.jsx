import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  Layers3,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";

const benefits = [
  {
    icon: Layers3,
    title: "Todo en un solo lugar",
    description:
      "Organiza empresas, cargos, fechas y avances sin perder información.",
  },
  {
    icon: BarChart3,
    title: "Visualiza tu progreso",
    description:
      "Convierte tus postulaciones en métricas que te ayuden a avanzar.",
  },
  {
    icon: ShieldCheck,
    title: "Información privada",
    description:
      "Tus procesos laborales permanecen protegidos dentro de tu cuenta.",
  },
];

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((currentData) => ({
        ...currentData,
  [name]: type === "checkbox" ? checked : value,
}));

  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-28 bottom-0 size-96 rounded-full bg-cyan-400/10 blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden border-r border-white/5 px-12 py-10 lg:flex lg:flex-col xl:px-20">
          <BrandLogo />

          <div className="my-auto max-w-2xl py-16">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles className="size-3.5" aria-hidden="true" />
              TU PRÓXIMA OPORTUNIDAD EMPIEZA AQUÍ
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
              Organiza tu búsqueda.
              <span className="mt-2 block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Acelera tu carrera.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              JobTrack transforma una búsqueda laboral desordenada en un
              proceso claro, medible y enfocado.
            </p>

            <div className="mt-11 grid gap-6">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex max-w-xl gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Icon
                      className="size-5 text-blue-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-100">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 max-w-xl rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Resumen semanal
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    Tu progreso continúa creciendo
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <Check className="size-3.5" aria-hidden="true" />
                  Activo
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 divide-x divide-white/10">
                <div className="pr-4">
                  <p className="text-2xl font-bold">24</p>
                  <p className="mt-1 text-xs text-slate-500">Postulaciones</p>
                </div>

                <div className="px-4">
                  <p className="text-2xl font-bold">6</p>
                  <p className="mt-1 text-xs text-slate-500">Entrevistas</p>
                </div>

                <div className="pl-4">
                  <p className="text-2xl font-bold text-blue-400">25%</p>
                  <p className="mt-1 text-xs text-slate-500">Respuesta</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Diseñado para quienes buscan avanzar con intención.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <BrandLogo />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0c1224]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-blue-400">
                  ACCESO SEGURO
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Bienvenido de nuevo
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  Continúa organizando el camino hacia tu próxima oportunidad.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-slate-200"
                    htmlFor="email"
                  >
                    Correo electrónico
                  </label>

                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      required
                      type="email"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>

                    <button
                      className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
                      type="button"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10"
                      id="password"
                      minLength={8}
                      name="password"
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                    />

                    <button
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" aria-hidden="true" />
                      ) : (
                        <Eye className="size-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-slate-400">
                  <input
                    checked={formData.remember}
                    className="size-4 rounded border-white/20 bg-white/5 accent-blue-600"
                    name="remember"
                    onChange={handleChange}
                    type="checkbox"
                  />
                  Recordarme en este dispositivo
                </label>

                <button
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  type="submit"
                >
                  Iniciar sesión
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition group-hover:translate-x-1"
                  />
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs uppercase tracking-[0.18em] text-slate-600">
                  Nueva cuenta
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-sm text-slate-400">
                ¿Aún no tienes una cuenta?{" "}
                <button
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                  type="button"
                >
                  Crear una cuenta
                </button>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              Al continuar, aceptas las condiciones de uso y la política de
              privacidad de JobTrack.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;