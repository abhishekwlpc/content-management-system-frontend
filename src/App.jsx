import {BrowserRouter,Routes,Route} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import FileListPage from "./pages/FileListPage";
import ToastContainer from "./components/ToastContainer";

function App(){

    return(

        <BrowserRouter>

            <ToastContainer/>

            <Routes>

                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/upload" element={<UploadPage/>}/>
                <Route path="/files" element={<FileListPage/>}/>

            </Routes>

        </BrowserRouter>

    );
}

export default App;