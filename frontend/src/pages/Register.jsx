import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        isAdmin,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate(data.isAdmin ? "/admin" : "/events");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
        
        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start booking events effortlessly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">

          {/* Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition"
            />
          </div>

          {/* Account Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`rounded-xl border py-2 text-sm transition ${
                !isAdmin
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`rounded-xl border py-2 text-sm transition ${
                isAdmin
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;