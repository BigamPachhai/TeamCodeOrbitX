import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "./Toast";

export default function QRCodeScanner({ onScan, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { success, error, warning } = useToast();

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      error("Camera access denied. Please allow camera permission.");
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      stopScanning();
      if (onScan) {
        onScan(data);
      }
      success("QR Code scanned successfully!");
    }
  };

  // Simple QR code detection (for demo - in production, use a library like jsQR)
  const checkQRCode = () => {
    // This is a placeholder - in production, you'd use a QR code library
    // For now, we'll show a manual input option
    warning("Auto-detection requires QR code library. Use manual input for now.");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#003865] border-b-4 border-[#DC143C] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6" />
              <h2 className="text-lg font-bold uppercase tracking-wide">QR Code Scanner</h2>
            </div>
            <button
              onClick={() => {
                stopScanning();
                if (onClose) onClose();
              }}
              className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {!isScanning ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#003865] mb-2">
                Scan QR Code for Quick Reporting
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Point your camera at a QR code to automatically fill location and category information
              </p>
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors font-semibold flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                Start Scanning
              </button>

              {/* Manual QR Code Input */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Or Enter QR Code Manually</p>
                <input
                  type="text"
                  placeholder="Paste QR code data here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#003865] focus:ring-1 focus:ring-[#003865] focus:outline-none text-sm"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleScan(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-4 border-white rounded-lg" style={{ width: "70%", aspectRatio: "1" }}></div>
                </div>
              </div>
              <button
                onClick={stopScanning}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Stop Scanning
              </button>
            </div>
          )}

          {scannedData && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800">QR Code Scanned!</p>
              </div>
              <p className="text-sm text-gray-700 break-all">{scannedData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

