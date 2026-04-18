import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const response = await loginUser(form);
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (!token) {
        throw new Error("Login succeeded but token is missing");
      }

      login(token, user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-card p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600 mb-3">Account</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sign in</h1>
        <p className="text-sm text-slate-500 mb-8">Frontend placeholder form ready to connect to backend auth APIs.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-brand text-white font-semibold rounded-xl px-5 py-3 shadow-button hover:shadow-button-hover transition-all"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
