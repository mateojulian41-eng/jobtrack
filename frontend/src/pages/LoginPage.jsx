import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import api from "../services/api";

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((currentData) => {
      if (type === "checkbox") {
        return {
          ...currentData,
          remember: checked,
        };
      }

      if (name === "email") {
        return {
          ...currentData,
          email: value,
        };
      }

      return {
        ...currentData,
        password: value,
      };
    });

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { token, user } = response.data.data;

      localStorage.removeItem("jobtrack_token");
      localStorage.removeItem("jobtrack_user");
      sessionStorage.removeItem("jobtrack_token");
      sessionStorage.removeItem("jobtrack_user");

      const storage = formData.remember
        ? localStorage
        : sessionStorage;

      storage.setItem("jobtrack_token", token);
      storage.setItem("jobtrack_user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Invalid email or password") {
        setErrorMessage(
          "El correo o la contraseña son incorrectos.",
        );
      } else {
        setErrorMessage(
          backendMessage ||
            "No fue posible iniciar sesión. Verifica que ambos servidores estén funcionando.",
        );
      }
    } finally {
      setIsLoading(false);
    }
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
              <Sparkles
                aria-hidden="true"
                className="size-3.5"
              />

              TU PRÓXIMA OPORTUNIDAD EMPIEZA AQUÍ
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
              Organiza tu búsqueda.

              <span className="mt-2 block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Acelera tu carrera.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              JobTrack transforma una búsqueda laboral desordenada en
              un proceso claro, medible y enfocado.
            </p>

            <div className="mt-11 grid gap-6">
              {benefits.map(
                ({ icon: Icon, title, description }) => (
                  <article
                    className="flex max-w-xl gap-4"
                    key={title}
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon
                        aria-hidden="true"
                        className="size-5 text-blue-400"
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-100">
                        {title}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {description}
                      </p>
                    </div>
                  </article>
                ),
              )}
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
                  <Check
                    aria-hidden="true"
                    className="size-3.5"
                  />

                  Activo
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 divide-x divide-white/10">
                <div className="pr-4">
                  <p className="text-2xl font-bold">24</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Postulaciones
                  </p>
                </div>

                <div className="px-4">
                  <p className="text-2xl font-bold">6</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Entrevistas
                  </p>
                </div>

                <div className="pl-4">
                  <p className="text-2xl font-bold text-blue-400">
                    25%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Respuesta
                  </p>
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
                  Continúa organizando el camino hacia tu próxima
                  oportunidad.
                </p>
              </div>

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                {errorMessage && (
                  <div
                    className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

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
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isLoading}
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
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      className="text-sm font-medium text-slate-200"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>

                  </div>

                  <div className="relative">
                    <input
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isLoading}
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
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      type="button"
                    >
                      {showPassword ? (
                        <EyeOff
                          aria-hidden="true"
                          className="size-5"
                        />
                      ) : (
                        <Eye
                          aria-hidden="true"
                          className="size-5"
                        />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-slate-400">
                  <input
                    checked={formData.remember}
                    className="size-4 accent-blue-600"
                    disabled={isLoading}
                    name="remember"
                    onChange={handleChange}
                    type="checkbox"
                  />

                  Recordarme en este dispositivo
                </label>

                <button
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-busy={isLoading}
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      />

                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar sesión

                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition group-hover:translate-x-1"
                      />
                    </>
                  )}
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
                  onClick={() => navigate("/register")}
                  type="button"
                >
                  Crear una cuenta
                </button>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              Al continuar, aceptas las condiciones de uso y la
              política de privacidad de JobTrack.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;