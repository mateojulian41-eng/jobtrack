import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import BrandLogo from "../components/BrandLogo";
import api from "../services/api";
import { saveSession } from "../utils/authStorage";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setErrorMessage("");
  }

  function validateForm() {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !formData.password || !formData.confirmPassword) {
      return "Completa todos los campos para continuar.";
    }

    if (name.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }

    if (!emailPattern.test(email)) {
      return "Ingresa un correo electrónico válido.";
    }

    if (formData.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const loginResponse = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const { token, user } = loginResponse.data.data;

      saveSession(token, user, true);
      navigate("/dashboard");
    } catch (error) {
      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Email is already registered") {
        setErrorMessage("Este correo ya está registrado.");
      } else {
        setErrorMessage(
          backendMessage ||
            "No fue posible crear la cuenta. Verifica que el servidor esté funcionando.",
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
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <BarChart3 aria-hidden="true" className="size-3.5" />
              TU BÚSQUEDA, CON DIRECCIÓN
            </p>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Convierte tus metas en
              <span className="mt-2 block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">progreso visible.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Crea tu espacio personal para organizar oportunidades, medir avances y tomar mejores decisiones.</p>
            <div className="mt-11 grid gap-5">
              {["Un espacio claro para cada oportunidad", "Métricas que acompañan tu avance", "Tus datos laborales, siempre privados"].map((benefit) => (
                <div className="flex items-center gap-3 text-sm text-slate-300" key={benefit}>
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300"><Check aria-hidden="true" className="size-4" /></span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-600">Diseñado para quienes buscan avanzar con intención.</p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden"><BrandLogo /></div>
            <div className="rounded-[28px] border border-white/10 bg-[#0c1224]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-blue-400">NUEVO COMIENZO</p>
                <h2 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h2>
                <p className="mt-3 leading-6 text-slate-400">Empieza a organizar tu búsqueda laboral con claridad.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {errorMessage && <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300" role="alert">{errorMessage}</div>}
                <FormField autoComplete="name" icon={UserRound} id="register-name" label="Nombre completo" name="name" onChange={handleChange} placeholder="Tu nombre completo" type="text" value={formData.name} />
                <FormField autoComplete="email" icon={Mail} id="register-email" label="Correo electrónico" name="email" onChange={handleChange} placeholder="tu@correo.com" type="email" value={formData.email} />
                <PasswordField autoComplete="new-password" id="register-password" label="Contraseña" onChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} value={formData.password} />
                <PasswordField autoComplete="new-password" id="register-confirm-password" label="Confirmar contraseña" name="confirmPassword" onChange={handleChange} showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} value={formData.confirmPassword} />

                <button className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
                  {isLoading ? <><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Creando cuenta...</> : <>Crear cuenta<ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" /></>}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4"><div className="h-px flex-1 bg-white/10" /><span className="text-xs uppercase tracking-[0.18em] text-slate-600">Ya eres parte</span><div className="h-px flex-1 bg-white/10" /></div>
              <p className="text-center text-sm text-slate-400">¿Ya tienes una cuenta? <button className="font-semibold text-blue-400 transition hover:text-blue-300" onClick={() => navigate("/")} type="button">Ya tengo una cuenta</button></p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FormField({ autoComplete, icon: Icon, id, label, name, onChange, placeholder, type, value }) {
  return <div><label className="mb-2 block text-sm font-medium text-slate-200" htmlFor={id}>{label}</label><div className="relative"><Icon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input autoComplete={autoComplete} className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10" id={id} name={name} onChange={onChange} placeholder={placeholder} required type={type} value={value} /></div></div>;
}

function PasswordField({ autoComplete, id, label, name = "password", onChange, setShowPassword, showPassword, value }) {
  return <div><label className="mb-2 block text-sm font-medium text-slate-200" htmlFor={id}>{label}</label><div className="relative"><LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input autoComplete={autoComplete} className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-blue-500/[0.04] focus:ring-4 focus:ring-blue-500/10" id={id} minLength={8} name={name} onChange={onChange} required type={showPassword ? "text" : "password"} value={value} /><button aria-label={showPassword ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}</button></div></div>;
}

export default RegisterPage;
