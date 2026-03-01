import { useEffect, useState } from "react";
import "./Toast.css";

function Toast({ message, type = "info", duration = 4000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - (100 / (duration / 50));
                if (newProgress <= 0) {
                    return 0;
                }
                return newProgress;
            });
        }, 50);

        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <span>{message}</span>
                <button className="toast-close" onClick={handleClose}>×</button>
            </div>
            <div className="toast-progress">
                <div className="toast-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

export default Toast;

