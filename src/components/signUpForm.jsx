import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css"; // reuse same CSS
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';




export default function SignupForm() {
    const [college, setCollege] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigate();

    // Inside component, before return:
    const [userId, setUserId] = useState("");
    const API = import.meta.env.VITE_BACKEND_URL;

    const generateUserId = () => {
        const name = username.trim() !== "" ? username.toLowerCase() : "user";
        const randomNum = Math.floor(10000 + Math.random() * 9000); // 4-digit number
        setUserId(`${name}-${randomNum}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !college || !userId) {
            alert("Please fill all fields and generate ID.");
            return;
        }

        try {
            const response = await axios.post(`${API}/auth/signup`, {
                name: username,
                email,
                password,
                campus: college,
                userId,
            });

            if (response.status === 201 || response.status === 200) {
                alert("Account created successfully!");
                localStorage.setItem("token", response.data.token)
                navigation("/welcome");
                window.location.reload();

                // Optionally redirect or clear form
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert(err.response?.data?.message || "Signup failed!");
        }
    };




    return (
        <div className="min-vw-100 d-flex flex-column justify-content-between align-items-center">
            {/* Header */}
            <div
                className="d-flex flex-start bg-primary card p-4"
                style={{ width: "22rem", height: "6rem", backgroundColor: "#2c2f35", borderRadius: "15px", boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
            >
                <h2 className="text-white mb-4 pb-6">Sign Up</h2>
            </div>

            {/* Form Container */}

            <form className="d-flex align-items-center justify-content-center flex-grow-1" onSubmit={handleSubmit}>
                <div
                    className="card p-4 bg-secondary"
                    style={{
                        width: "22rem",
                        position: "relative",
                        top: "-30px",
                        backgroundColor: "#2c2f35",
                        zIndex: "2px",
                        borderRadius: "15px",
                        background: "  linear-gradient(135deg, #fce7dd, #f9d0ba)",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px"
                    }}
                >



                    {/* Email */}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="floatingEmail"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingEmail" className="text-muted">
                            Email
                        </label>


                    </div>



                    {/* Password */}
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
                        <label htmlFor="floatingPassword" className="text-muted">
                            Password
                        </label>

                    </div>
                    {/* College Name */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="floatingCollege"
                            placeholder="College Name"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingCollege" className="text-muted">
                            Campus Name
                        </label>

                    </div>

                    {/* Username */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="floatingUsername"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="floatingUsername" className="text-muted">
                            Username
                        </label>

                    </div>

                    {/* User ID (Read-only) */}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control bg-transparent text-dark border-secondary"
                            id="generatedUserId"
                            placeholder="User ID"
                            value={userId}
                            readOnly
                        />
                        <label htmlFor="generatedUserId" className="text-muted">
                            Generated User ID
                        </label>
                    </div>

                    {/* Generate ID Button */}
                    <button
                        type="button"
                        onClick={generateUserId}
                        className="bg-primary text-light btn  w-100 mb-3"
                    >
                        Generate ID
                    </button>



                    {/* Submit Button */}
                    <button className="mt-4 text-light  fs-5 btn btn-primary w-100 shadow-sm" type="submit">
                        Sign Up
                    </button>

                    <button className="fs-5 mt-3 text-light btn btn-primary w-100 shadow-sm d-flex justify-content-center align-items-center gap-2" type="submit">
                        <div>
                            continue with</div>

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
                        > <GoogleIcon /></div>
                    </button>
                    <div className="text-center mt-3">
                        <p>
                            Already have an account?{' '}
                            <Link to="/">
                                <a className="text-primary">
                                    Login
                                </a>
                            </Link>
                        </p>
                    </div>


                </div>
            </form>
        </div>
    );
}  