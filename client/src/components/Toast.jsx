import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, "success", duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, "error", duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, "info", duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, "warning", duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          iconBg: "bg-green-100",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          iconBg: "bg-yellow-100",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          iconBg: "bg-blue-100",
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md w-full">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`${styles.bg} border-2 rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-full duration-300`}
          >
            <div className={`${styles.iconBg} rounded-full p-1 flex-shrink-0`}>
              {styles.icon}
            </div>
            <div className={`flex-1 ${styles.text} font-medium text-sm`}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

