function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-white">JobTrack</h1>

        <p className="mt-3 text-slate-400">
          Tu búsqueda laboral, organizada.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500">
          Comenzar
        </button>
      </div>
    </main>
  );
}

export default App;