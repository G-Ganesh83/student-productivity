function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Account and app settings will appear here as the backend support grows.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-slate-900">Coming Soon</h2>
        <p className="mt-2 text-sm text-slate-500">
          This page is live so navigation works correctly, but settings management is not implemented yet.
        </p>
      </div>
    </div>
  );
}

export default Settings;
