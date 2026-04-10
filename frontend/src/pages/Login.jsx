
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState(""); 
    const [error, setError] =useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
           
          const response = await axios.post(
  "http://localhost:3000/api/auth/login",
  { email, password }
);

console.log(response.data);

if (response.data.success) {
    

  await login(response.data.user, response.data.token);

  if (response.data.user.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/customer/dashboard");
  }
} else {
  setError(response.data.message);
}
        } catch (error) {
            if(error.response){
                setError(error.response.data.message);
            }
            
        } finally {
            setIsLoading(false);
        }
    };
   return (
  <div className="flex flex-col items-center  h-screen justify-center  bg-gradient-to-b from-green-600 from-50% to-gray-50% space-y-6">
    <h1 className="text-3xl font-bold text-center text-white">
        PRODUCT MANAGEMENT SYSTEM
      </h1>

    <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-96">
      <h2 className="text-3xl font-bold  text-black mb-4">
        Login
      </h2>
      

      {error && (
        <p className="text-red-300 text-sm text-center mb-4">
          {error}
        </p>
      )}

     <form onSubmit={handleSubmit} className="space-y-4">
    
       
        <div>
          <label className="block font-medium text-black mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Enter your email"
            onChange={(e)=> setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block  font-medium text-black mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Enter your password"
            onChange={(e)=> setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-100 transition duration-300 shadow-md"
        >
            
          {isLoading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  </div>
);
}

export default Login;