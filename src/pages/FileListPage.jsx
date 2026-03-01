import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function FileListPage() {

    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const downloadFile = async (file) => {
        if (!file || !file.id) return;

        try {
            setDownloadingId(file.id);
            window.showToast(`Starting download: ${file.fileName}`, "info", 2000);

            const res = await api.get(`/content/download/${file.id}`, {
                responseType: "blob",
            });

            const disposition = res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"];
            let filename = file.fileName || "download";
            if (disposition) {
                const match = disposition.match(/filename\*=UTF-8''([^;\n]+)/i) || disposition.match(/filename="?([^";\n]+)"?/i);
                if (match && match[1]) {
                    try {
                        // decode RFC5987 encoded filename if present
                        filename = decodeURIComponent(match[1]);
                    } catch (e) {
                        filename = match[1];
                    }
                }
            }

            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            window.showToast(`Downloaded: ${filename}`, "success", 3000);
        } catch (err) {
            console.error("Download error:", err);
            window.showToast("Download failed: " + (err.response?.data?.message || err.message), "error", 5000);
        } finally {
            setDownloadingId(null);
        }
    };

    useEffect(() => {

        const loadFiles = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching from: /content/all");
                const res = await api.get("/content/all");
                console.log("API Response Status:", res.status);
                console.log("Type of res.data:", typeof res.data);
                console.log("Is res.data an array?", Array.isArray(res.data));
                console.log("res.data keys:", Object.keys(res.data || {}));

                let fileList = [];

                if (Array.isArray(res.data)) {
                    fileList = res.data;
                    console.log("✓ Response is array, found", fileList.length, "files");
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    fileList = res.data.data;
                    console.log("✓ Response.data is array, found", fileList.length, "files");
                } else if (res.data?.files && Array.isArray(res.data.files)) {
                    fileList = res.data.files;
                    console.log("✓ Response.files is array, found", fileList.length, "files");
                } else if (res.data?.content && Array.isArray(res.data.content)) {
                    fileList = res.data.content;
                    console.log("✓ Response.content is array, found", fileList.length, "files");
                } else {
                    console.warn("✗ Unexpected response structure:", res.data);
                }

                console.log("Found", fileList.length, "files to display");
                if (fileList.length > 0) {
                    console.log("First file:", {
                        fileName: fileList[0].fileName,
                        fileSize: fileList[0].fileSize,
                        fileUrl: fileList[0].fileUrl
                    });
                }

                setFiles(fileList);
            } catch (err) {
                console.error("Error loading files:", err.message);
                setError(err.response?.data?.message || err.message || "Failed to load files");
            } finally {
                setLoading(false);
            }
        };

        loadFiles();

    }, []);

    return (

        <div>

            <div className="navbar">

                <Link to="/dashboard">Dashboard</Link>
                <Link to="/upload">Upload</Link>
                <Link to="/files">My Files</Link>
                <button onClick={handleLogout} style={{marginLeft: "auto"}}>Logout</button>

            </div>

            <div style={{padding:"20px"}}>

                <h2>All Files</h2>

                {loading && <p style={{color: "#667eea", fontSize: "16px"}}>Loading files...</p>}

                {error && <p style={{color: "#d32f2f", fontSize: "16px"}}>Error: {error}</p>}

                {!loading && !error && files.length === 0 && (
                    <p style={{color: "#999", fontSize: "16px"}}>No files uploaded yet. <Link to="/upload">Upload a file</Link></p>
                )}

                {!loading && !error && files.length > 0 && files.map(file => {
                    return (
                    <div key={file.id} style={{
                        background: "white",
                        padding: "15px",
                        margin: "10px 0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>

                        <div>
                            <p style={{margin: "0 0 5px 0", fontWeight: "bold"}}>{file.fileName}</p>
                            <p style={{margin: "0", fontSize: "12px", color: "#666"}}>
                                Size: {(file.fileSize / 1024).toFixed(2)} KB | Type: {file.fileType}
                            </p>
                        </div>

                        <button
                            onClick={() => downloadFile(file)}
                            disabled={downloadingId === file.id}
                            style={{
                                marginLeft: "20px",
                                padding: "8px 16px",
                                backgroundColor: "#667eea",
                                color: "white",
                                border: "none",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: downloadingId === file.id ? "not-allowed" : "pointer",
                                opacity: downloadingId === file.id ? 0.7 : 1
                            }}
                        >
                            {downloadingId === file.id ? "Downloading..." : "Download"}
                        </button>

                    </div>
                    );
                })}

            </div>


        </div>
    );
}

export default FileListPage;