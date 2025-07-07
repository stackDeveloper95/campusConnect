import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css";
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from "react-router-dom";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API = import.meta.env.VITE_BACKEND_URL;


    console.log("Backend URL:", API);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submit
        try {
            const response = await axios.post(`${API}/auth/login`, {
                email: username,
                password,
            });

            // Handle success: maybe store token, redirect, etc.
            localStorage.setItem("token", response.data.token)
            console.log("Login successful:", response.data);
            window.location.reload();
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-vw-100 d-flex flex-column justify-content-between align-items-center">
            {/* Login Header */}
            <div className="d-flex flex-start bg-primary card p-4"
                style={{ width: "22rem", height: "6rem", backgroundColor: "#2c2f35", borderRadius: "15px" }}>
                <h2 className="text-white mb-4 pb-6">Login</h2>
            </div>

            {/* Form Card */}
            <div className="d-flex align-items-center justify-content-center flex-grow-1">
                <form
                    onSubmit={handleLogin}
                    className="card p-4"
                    style={{
                        width: "22rem",
                        backgroundColor: "#2c2f35",
                        position: "relative",
                        top: "-30px",
                        zIndex: 2,
                        borderRadius: "15px",
                        background: "linear-gradient(135deg, #fce7dd, #f9d0ba)"
                    }}
                >
                    {/* Username Field */}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="floatingUsername"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingUsername" className="text-muted">Email Id</label>
                    </div>

                    {/* Password Field */}
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingPassword" className="text-muted">Password</label>
                    </div>

                    {/* Error */}
                    {error && <div className="alert alert-danger py-1">{error}</div>}

                    {/* Forgot Password */}
                    <div className="text-start pb-3">
                        <a href="/forgot-password" className="text-decoration-none text-primary">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button className="fs-5 text-white btn btn-primary w-100 shadow-sm" type="submit">
                        Login
                    </button>

                    {/* Google Login Placeholder */}
                    <button
                        className="fs-5 mt-3 text-light btn btn-primary w-100 shadow-sm d-flex justify-content-center align-items-center gap-2"
                        type="button"
                    >
                        <div>Continue with</div>
                        <div
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                background: "conic-gradient(#4285F4 0% 25%, #34A853 25% 50%, #FBBC05 50% 75%, #EA4335 75% 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "#fff"
                            }}
                        >
                            <GoogleIcon />
                        </div>
                    </button>

                    {/* Sign Up */}
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signUp">
                                <span className="text-primary">Sign Up</span>
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
