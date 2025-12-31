import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {

    const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
//   const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);



  const submit = async e => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/register", form);

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 mb-4 shadow-lg shadow-orange-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm">
              Join us today and start your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-800/50 border-2 ${
                    focusedField === 'name' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'border-slate-700/50'
                  } px-4 py-3.5 text-white placeholder-slate-500 text-sm
                    focus:outline-none transition-all duration-300`}
                  placeholder="John Doe"
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-800/50 border-2 ${
                    focusedField === 'email' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'border-slate-700/50'
                  } px-4 py-3.5 text-white placeholder-slate-500 text-sm
                    focus:outline-none transition-all duration-300`}
                  placeholder="you@example.com"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-slate-800/50 border-2 ${
                    focusedField === 'password' 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'border-slate-700/50'
                  } px-4 py-3.5 text-white placeholder-slate-500 text-sm
                    focus:outline-none transition-all duration-300`}
                  placeholder="••••••••"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getStrengthColor() : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  {getStrengthText() && (
                    <p className="text-xs text-slate-400">
                      Password strength: <span className={`font-medium ${
                        passwordStrength === 1 ? 'text-red-400' :
                        passwordStrength === 2 ? 'text-yellow-400' :
                        passwordStrength === 3 ? 'text-blue-400' :
                        'text-green-400'
                      }`}>{getStrengthText()}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-purple-600 rounded-xl py-3.5 font-semibold text-white
                shadow-lg shadow-orange-500/30 transition-all duration-300
                hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <a  onClick={() => navigate("/login")}
 
            className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>

  );
}
