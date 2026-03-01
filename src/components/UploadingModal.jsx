import "./UploadingModal.css";

function UploadingModal({ isVisible, progress = 0, fileName = "" }) {
    if (!isVisible) return null;

    return (
        <div className="uploading-modal-overlay">
            <div className="uploading-modal">
                <h2>Uploading File</h2>
                <p className="file-name">{fileName}</p>

                <div className="progress-container">
                    <div className="progress-bar-wrapper">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{Math.round(progress)}%</span>
                </div>

                <p className="uploading-text">Please wait while your file is being uploaded...</p>
            </div>
        </div>
    );
}

export default UploadingModal;

