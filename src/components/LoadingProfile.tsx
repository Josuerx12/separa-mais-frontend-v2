const metricSkeleton = ["m1", "m2", "m3", "m4"];

const statusSkeleton = [
  "Em separacao",
  "Aguardando coleta",
  "Canceladas",
  "Concluidas",
] as const;

const LoadingProfile = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ecfeff,#f8fafc_40%,#eef2ff)]">
      <div className="pointer-events-none absolute -left-12 top-12 h-56 w-56 rounded-full bg-cyan-200/45 blur-3xl loading-float" />
      <div className="pointer-events-none absolute -right-10 bottom-8 h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl loading-float loading-delay-1" />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <section className="reveal-up rounded-3xl border border-cyan-100/80 bg-white/85 p-6 shadow-xl shadow-cyan-100/40 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="loading-shimmer h-3 w-36 rounded-full bg-slate-200/85" />
              <div className="loading-shimmer h-8 w-72 max-w-[80vw] rounded-full bg-slate-200/85" />
              <div className="loading-shimmer h-4 w-96 max-w-[86vw] rounded-full bg-slate-200/80" />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-bounce" />
              <span
                className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-bounce"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-bounce"
                style={{ animationDelay: "240ms" }}
              />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricSkeleton.map((cardKey) => (
            <article
              key={cardKey}
              className="reveal-up rounded-2xl border border-slate-200 bg-white/88 p-4 shadow-sm shadow-slate-900/5"
            >
              <div className="space-y-3">
                <div className="loading-shimmer h-3 w-28 rounded-full bg-slate-200/80" />
                <div className="loading-shimmer h-9 w-20 rounded-xl bg-slate-200/85" />
                <div className="loading-shimmer h-3 w-40 rounded-full bg-slate-200/75" />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusSkeleton.map((statusTitle) => (
            <article
              key={statusTitle}
              className="reveal-up rounded-2xl border border-slate-200 bg-white/88 p-4 shadow-sm shadow-slate-900/5"
            >
              <div className="space-y-2">
                <div className="loading-shimmer h-4 w-32 rounded-full bg-slate-200/80" />
                <div className="loading-shimmer h-3 w-44 rounded-full bg-slate-200/70" />
              </div>

              <div className="mt-4 space-y-3">
                {metricSkeleton.slice(0, 2).map((item) => (
                  <div
                    key={`${statusTitle}-${item}`}
                    className="rounded-xl border border-slate-100 bg-white p-3"
                  >
                    <div className="space-y-2">
                      <div className="loading-shimmer h-3 w-24 rounded-full bg-slate-200/75" />
                      <div className="loading-shimmer h-3 w-40 rounded-full bg-slate-200/70" />
                      <div className="loading-shimmer h-3 w-20 rounded-full bg-slate-200/75" />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default LoadingProfile;
