import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import "./LoginSignup.css";


const AuthForm = ({ route, method}) => {
    const [action, setAction] = useState(method);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sucess, setSucess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSucess(null);
        if (
            email ||
            password ||
            (action === "Sign Up" && !username)
          ) {
            setError("All fields are required.");
            // alert("All fields are required.");
            return;
          }

        try {
            const res = await api.post(route, { username, password });

            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
                window.location.reload();
            } else {
                setSucess("Registration successful. Please login.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
        }   catch (error) {
              console.error(error);
              if (error.response) {
                if (error.response.status === 401) {
                    setError("Invalid credentials");
                } else if (error.response.status === 400) {
                    setError("Username already exists");
                } else {
                    setError("Something went wrong. Please try again.");
                }
              } else if (error.request) {
                setError("Network error. Please check your internet connection.");
              } else {
                setError("Something went wrong. Please try again.");
              }
        }   finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner"></div>}
                </div>
            )}
            {!loading && (
                <div className="container">
                    <div className="header">
                      <div className="text">{action}</div>
                      <div className="underline"></div>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        {sucess && <div className="success-message">{sucess}</div>}
                        <div className="inputs">
                            {action === "Login" ? (
                            <div></div>
                            ) : (
                            <div className="input">
                                <User class="login-signup-icons" />
                                <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                />
                            </div>
                            )}
                            <div className="input">
                            <Mail class="login-signup-icons" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email ID"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            </div>
                            <div className="input">
                            <KeyRound class="login-signup-icons" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            </div>
                        </div>
                        {action === "Sign Up" ? (
                            <div></div>
                        ) : (
                            <div className="forgot-password">
                            Lost Password? <span><Link to="/forgotpassword">Click here!</Link></span>
                            </div>
                        )}
                        {error && <div className="error-message">{error}</div>}
                        <div className="submit-container">
                            <button
                            type="submit"
                            className={action === "Login" ? "submitgray" : "submit"}
                            onClick={() => {
                                if (action === "Login") 
                                handleReset();
                                setAction("Sign Up");
                            }}
                            >
                            Sign Up
                            </button>
                            <button
                            type="submit"
                            className={action === "Sign Up" ? "submitgray" : "submit"}
                            onClick={() => {
                                if (action === "Sign Up") 
                                handleReset();
                                setAction("Login");
                            }}
                            >
                            Login
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AuthForm;