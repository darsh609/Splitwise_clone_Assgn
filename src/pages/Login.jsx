// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../services/api";
// import AuthLayout from "../components/AuthLayout";
// // import jwtDecode from "jwt-decode";
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/users/login", { email, password });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.id);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       toast.success("Login successful");

//       // IMPORTANT: delay navigation so toast is visible
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 800);

//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Login to your account">
//       <form onSubmit={submit} className="space-y-5">
//         {/* Email */}
//         <div className="space-y-1">
//           <label className="text-sm text-muted">Email</label>
//           <input
//             type="email"
//             className="w-full rounded-lg bg-bg border border-gray-700 px-4 py-3 text-sm
//               focus:outline-none focus:ring-2 focus:ring-primary/50"
//             placeholder="you@example.com"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Password */}
//         <div className="space-y-1">
//           <label className="text-sm text-muted">Password</label>
//           <input
//             type="password"
//             className="w-full rounded-lg bg-bg border border-gray-700 px-4 py-3 text-sm
//               focus:outline-none focus:ring-2 focus:ring-primary/50"
//             placeholder="••••••••"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//         </div>

//         {/* Button */}
//         <button
//           disabled={loading}
//           className="w-full bg-primary rounded-lg py-3 font-semibold text-white
//             transition hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       <p className="text-center text-sm text-muted mt-6">
//         Don’t have an account?{" "}
//         <Link to="/signup" className="text-accent font-medium hover:underline">
//           Sign up
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 mb-4 shadow-lg shadow-purple-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
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
                  type="email"
                  className={`w-full rounded-xl bg-slate-800/50 border-2 ${
                    focusedField === 'email' 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'border-slate-700/50'
                  } px-4 py-3.5 text-white placeholder-slate-500 text-sm
                    focus:outline-none transition-all duration-300`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  type="password"
                  className={`w-full rounded-xl bg-slate-800/50 border-2 ${
                    focusedField === 'password' 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'border-slate-700/50'
                  } px-4 py-3.5 text-white placeholder-slate-500 text-sm
                    focus:outline-none transition-all duration-300`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl py-3.5 font-semibold text-white
                shadow-lg shadow-purple-500/30 transition-all duration-300
                hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]
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
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900/50 px-4 text-slate-500 backdrop-blur-sm">
                OR CONTINUE WITH
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

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        {/* <p className="text-center text-xs text-slate-500 mt-6">
          Protected by reCAPTCHA and subject to the{" "}
          <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Terms of Service</a>
        </p> */}
      </div>
    </div>
  );
}