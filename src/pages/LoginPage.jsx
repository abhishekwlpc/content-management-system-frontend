import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const login = async () => {

        const res = await api.post("/auth/login", {
            email: email,
            password: password
        });

        localStorage.setItem("token",res.data);

        navigate("/dashboard");
    };

    return (

        <div className="container">

            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button onClick={login}>Login</button>

            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>

        </div>
    );
}

export default LoginPage;