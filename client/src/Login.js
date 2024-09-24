import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submission status to true

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        credentials
      );
      const token = response.data.token;

      // Save the token in local storage
      localStorage.setItem("token", token);
      setToken(token);
      setLoginStatus("Logged in successfully!");
      navigate("/upload");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginStatus("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false); // Set submission status to false
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-3xl font-bold text-center mb-4">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => {
              setCredentials({ ...credentials, username: e.target.value });
              setLoginStatus(""); // Clear login status on input change
            }}
            placeholder="Enter username"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => {
              setCredentials({ ...credentials, password: e.target.value });
              setLoginStatus(""); // Clear login status on input change
            }}
            placeholder="Enter password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      {loginStatus && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            loginStatus.includes("failed")
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {loginStatus}
        </div>
      )}
    </div>
  );
};

export default Login;
