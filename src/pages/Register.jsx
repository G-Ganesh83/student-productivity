import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    if (!normalizedForm.name || !normalizedForm.email || !normalizedForm.password) {
      setError("Name, email, and password are required");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      await registerUser(normalizedForm);
      navigate("/login");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600 mb-3">Account</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create account</h1>
        <p className="text-sm text-slate-500 mb-8">Frontend placeholder form ready for backend registration integration.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="Create a password"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-brand text-white font-semibold rounded-xl px-5 py-3 shadow-button hover:shadow-button-hover transition-all"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
