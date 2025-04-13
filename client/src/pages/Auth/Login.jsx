import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/AxiosInstance.js";
import { NETWORK_ERROR_MESSAGE,LOGIN_SUCCESS_MESSAGE,LOGIN_ERROR_MESSAGE,FIELDS_REQUIRED_MESSAGE,INVALID_EMAIL_MESSAGE } from "../../constants/messages.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(FIELDS_REQUIRED_MESSAGE);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(INVALID_EMAIL_MESSAGE);
      return;
    }

   

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const Token = response.data.Token;
      
      localStorage.setItem("token", Token);

      toast.success(LOGIN_SUCCESS_MESSAGE);
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/inventory"), 1000);
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response
        ? error.response.data.message || LOGIN_ERROR_MESSAGE
        : NETWORK_ERROR_MESSAGE;

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-teal-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white rounded-lg ${
              isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
