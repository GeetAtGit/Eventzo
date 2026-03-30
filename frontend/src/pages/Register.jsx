import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Shield, UserRound } from "lucide-react";

const AUTH_API = import.meta.env.VITE_AUTH_API;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Min 8 chars, include uppercase, lowercase, number & special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const payload = {
      name,
      email,
      password,
      isAdmin: role === "admin",
    };

    console.log("REGISTER PAYLOAD:", payload);

    try {
      const { data } = await axios.post(
        `${AUTH_API}/api/auth/register`,
        payload
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate(data.isAdmin ? "/admin" : "/events");
      window.location.reload();
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
        <div className="mb-7 text-center">
          <h2 className="text-lg font-medium text-slate-600">
            EventZen
          </h2>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start booking events effortlessly
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "", api: "" }));
                }}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "", api: "" }));
                }}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "", api: "" }));
                }}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Account Type
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`rounded-xl border p-3 text-sm transition ${
                  role === "customer"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-600 hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserRound size={16} />
                  Customer
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-xl border p-3 text-sm transition ${
                  role === "admin"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-600 hover:border-slate-400"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield size={16} />
                  Admin
                </div>
              </button>
            </div>
          </div>

          {errors.api && (
            <p className="text-sm text-red-500 text-center">{errors.api}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;