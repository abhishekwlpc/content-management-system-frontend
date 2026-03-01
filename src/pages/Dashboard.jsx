import { Link, useNavigate } from "react-router-dom";

function Dashboard(){

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return(

        <div>

            <div className="navbar">

                <Link to="/dashboard">Dashboard</Link>
                <Link to="/upload">Upload</Link>
                <Link to="/files">My Files</Link>
                <button onClick={handleLogout} style={{marginLeft: "auto"}}>Logout</button>

            </div>

            <div style={{padding:"20px"}}>

                <h2>Instructor Dashboard</h2>

                <p>Welcome to the Content Upload System.</p>

            </div>

        </div>

    );
}

export default Dashboard;