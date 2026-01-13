import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({updateAuth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      // ✅ Save user info in localStorage
      localStorage.setItem("userData", JSON.stringify(res.data));
      localStorage.setItem("token", res.data?.token);
      localStorage.setItem("role", res.data?.role);
      localStorage.setItem("teacherId", res?.data?.user?.id);
updateAuth(res.data?.token, res.data?.role);
      // ✅ Toast success message
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      // ✅ Redirect based on role
      setTimeout(() => {
  if (res.data.role === "owner") navigate("/dashboard");
  else navigate("/teacherDashboard");
}, 100);

    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      // ✅ Friendly error handling
      if (message.toLowerCase().includes("invalid token") || message.toLowerCase().includes("no user")) {
        toast.error("Invalid user ID!", { position: "top-right" });
      } else if (message.toLowerCase().includes("password")) {
        toast.error("Password is wrong!", { position: "top-right" });
      } else if (message.toLowerCase().includes("disabled") || message.toLowerCase().includes("inactive")) {
        toast.error("User ID is inactive. Contact admin.", { position: "top-right" });
      } else {
        toast.error(message, { position: "top-right" });
      }
    }
  };

  const handleGoBack = () => {
    navigate("/home"); 
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 overflow-hidden">

      {/* Floating Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-30 translate-x-1/3 translate-y-1/3 filter blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-60 h-60 bg-pink-300 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 filter blur-2xl"></div>

      {/* Left Image Section */}
      <div className="md:w-1/2 flex justify-center items-center p-8 z-10">
        <img
          src="/images/login.png"
          alt="Login Visual"
          className="w-3/4 h-auto object-contain rounded-lg shadow-lg z-10"
        />
      </div>

      {/* Right Login Form Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8 z-10 relative">
        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 relative z-20 transition-transform duration-300 hover:scale-[1.01]"
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">Welcome Back 👋</h2>
          <p className="text-center text-gray-500 mb-6">Log in to access your dashboard</p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Password Input with Conditional Eye Icon */}
          <div className="mb-6 relative">
            <label className="block text-gray-600 font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
              required
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Back to Main Page Button */}
        <button
          onClick={handleGoBack}
          className="mt-6 px-5 py-2 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          ← Back to Main Page
        </button>
      </div>
    </div>
  );
}
