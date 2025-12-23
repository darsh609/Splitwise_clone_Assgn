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
    // <AuthLayout title="Create your account">
    //   <form onSubmit={submit} className="space-y-5">
    //     {/* Name */}
    //     <div className="space-y-1">
    //       <label className="text-sm text-muted">Full Name</label>
    //       <input
    //         name="name"
    //         value={form.name}
    //         onChange={handleChange}
    //         placeholder="John Doe"
    //         className="w-full rounded-lg border border-gray-700 bg-bg px-4 py-3 text-sm 
    //           focus:outline-none focus:ring-2 focus:ring-primary/50"
    //       />
    //     </div>

    //     {/* Email */}
    //     <div className="space-y-1">
    //       <label className="text-sm text-muted">Email Address</label>
    //       <input
    //         name="email"
    //         type="email"
    //         value={form.email}
    //         onChange={handleChange}
    //         placeholder="you@example.com"
    //         className="w-full rounded-lg border border-gray-700 bg-bg px-4 py-3 text-sm 
    //           focus:outline-none focus:ring-2 focus:ring-primary/50"
    //       />
    //     </div>

    //     {/* Password */}
    //     <div className="space-y-1">
    //       <label className="text-sm text-muted">Password</label>
    //       <input
    //         name="password"
    //         type="password"
    //         value={form.password}
    //         onChange={handleChange}
    //         placeholder="••••••••"
    //         className="w-full rounded-lg border border-gray-700 bg-bg px-4 py-3 text-sm 
    //           focus:outline-none focus:ring-2 focus:ring-primary/50"
    //       />
    //     </div>

    //     {/* Button */}
    //     <button
    //       disabled={loading}
    //       className="w-full rounded-lg bg-accent py-3 font-semibold text-white 
    //         transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
    //     >
    //       {loading ? "Creating account..." : "Sign Up"}
    //     </button>
    //   </form>

    //   <p className="mt-6 text-center text-sm text-muted">
    //     Already have an account?{" "}
    //     <Link
    //       to="/login"
    //       className="font-medium text-primary hover:underline"
    //     >
    //       Login
    //     </Link>
    //   </p>
    // </AuthLayout>
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

            {/* Terms */}
            {/* <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-2 focus:ring-orange-500/50"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div> */}

            {/* Submit Button */}
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

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900/50 px-4 text-slate-500 backdrop-blur-sm">
                OR SIGN UP WITH
              </span>
            </div>
          </div> */}

          {/* Social Login Buttons */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div> */}

          {/* Login Link */}
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
