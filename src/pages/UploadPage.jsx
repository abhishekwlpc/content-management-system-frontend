import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import UploadingModal from "../components/UploadingModal";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

function UploadPage() {

    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.size > MAX_FILE_SIZE) {
            window.showToast("File size must be less than 100MB!", "error", 4000);
            e.target.value = null;
            return;
        }

        setFile(selectedFile);
    };

    const uploadFile = async () => {

        if (!file) {
            window.showToast("Please select a file first!", "warning", 3000);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            window.showToast("File size must be less than 100MB!", "error", 4000);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("instructorId", 1);

        setIsUploading(true);
        setUploadProgress(0);

        try {

            await api.post("/content/upload", formData, {
                onUploadProgress: (progressEvent) => {

                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    setUploadProgress(percentCompleted);
                },
            });

            window.showToast("File uploaded successfully!", "success", 4000);

            setIsUploading(false);
            setUploadProgress(0);
            setFile(null);

            navigate("/files");

        } catch (error) {

            setIsUploading(false);
            setUploadProgress(0);

            window.showToast(
                "Upload failed: " + (error.response?.data?.message || error.message),
                "error",
                5000
            );
        }
    };

    return (

        <div>

            <div className="navbar">

                <Link to="/dashboard">Dashboard</Link>
                <Link to="/upload">Upload</Link>
                <Link to="/files">My Files</Link>

                <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
                    Logout
                </button>

            </div>

            <div style={{ padding: "20px" }}>

                <h2>Upload File</h2>

                <input
                    style={{ marginRight: "100px", width: "300px" }}
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                <button
                    onClick={uploadFile}
                    disabled={isUploading}
                    style={{
                        opacity: isUploading ? 0.6 : 1,
                        cursor: isUploading ? "not-allowed" : "pointer"
                    }}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </button>

                <p style={{ marginTop: "10px", fontSize: "14px", color: "black" }}>
                    *Maximum file size: <p style={{color: "red"}}>100MB</p>
                </p>

                {file && (
                    <p style={{ marginTop: "5px", fontSize: "14px" }}>
                        Selected File: <b>{file.name}</b>
                    </p>
                )}

            </div>

            <UploadingModal
                isVisible={isUploading}
                progress={uploadProgress}
                fileName={file?.name || ""}
            />

        </div>
    );
}

export default UploadPage;