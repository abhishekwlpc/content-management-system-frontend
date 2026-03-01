import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage(){

    const navigate = useNavigate();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const register = async () => {

        await api.post("/auth/register",{
            name,email,password
        });

        alert("Registration successful");

        navigate("/");
    };

    return(

        <div className="container">

            <h2>Register</h2>

            <input
                placeholder="Name"
                onChange={(e)=>setName(e.target.value)}
            />

            <input
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button onClick={register}>Register</button>

            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>

        </div>

    );
}

export default RegisterPage;