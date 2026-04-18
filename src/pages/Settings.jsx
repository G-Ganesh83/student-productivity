import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { logout, user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your account information and manage your current session.
        </p>
      </header>

      <Card variant="brand" padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-button">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Account overview</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{user?.name || "Student User"}</h2>
              <p className="mt-1 text-sm text-slate-500">{user?.email || "No email available"}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-card">
            Your session is currently active. Logging out will disconnect you from live collaboration rooms.
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-bold text-slate-900">Profile information</h3>
          <p className="mt-1 text-sm text-slate-500">
            A simple view of the core account details currently available in the app.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Full name</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{user?.name || "Not available"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Email address</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 break-all">{user?.email || "Not available"}</p>
            </div>
          </div>
        </Card>

        <Card variant="default" padding="lg">
          <h3 className="text-lg font-bold text-slate-900">Session actions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Keep your account secure by ending the current session whenever needed.
          </p>

          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-sm font-medium text-red-700">
              Logging out will return you to the public experience and close any active authenticated socket session.
            </p>
          </div>

          <Button variant="danger" className="mt-6 w-full" onClick={logout}>
            Log Out
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
