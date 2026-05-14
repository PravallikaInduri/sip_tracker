import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-10 shadow-2xl shadow-slate-200/70 border border-slate-200">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Investor management</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Welcome to the SIP Investor Dashboard
            </h1>
            <p className="mt-6 max-w-2xl text-slate-600 leading-8">
              Sign in to access investor holdings, calculate portfolio net worth, and explore detailed investor records using the backend APIs.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to login
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                View dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Sample credentials</p>
            <div className="mt-6 rounded-3xl bg-slate-900 p-6 space-y-4">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Email</span>
                <strong>saranya@gmail.com</strong>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Password</span>
                <strong>saranya2005</strong>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-400">
              Login with the sample user from the backend model to access the investor routes and dashboard views.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
