import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, CheckCircle, X } from "lucide-react";
import { useToast } from "./Toast";

export default function VoiceRecorder({ onTranscript, language = "ne-NP" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const { success, error, warning } = useToast();

  useEffect(() => {
    // Check for browser support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          error("Microphone permission denied. Please allow microphone access.");
        } else {
          error("Speech recognition error. Please try again.");
        }
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, error]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      warning("Voice recording is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    try {
      setTranscript("");
      setIsRecording(true);
      recognitionRef.current.start();
      success("Voice recording started. Speak clearly in Nepali.");
    } catch (err) {
      console.error("Error starting recording:", err);
      error("Failed to start recording. Please try again.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (transcript.trim()) {
        setIsProcessing(true);
        setTimeout(() => {
          if (onTranscript) {
            onTranscript(transcript.trim());
          }
          setIsProcessing(false);
          success("Voice transcript added successfully!");
        }, 500);
      }
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    if (onTranscript) {
      onTranscript("");
    }
  };

  const isSupported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-[#003865] uppercase tracking-wide">
          Voice Report (Nepali)
        </label>
        {transcript && (
          <button
            onClick={clearTranscript}
            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Recording Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all ${
              isRecording
                ? "bg-[#DC143C] border-[#DC143C] text-white animate-pulse"
                : "bg-[#003865] border-[#003865] text-white hover:bg-[#004d8c]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1">
            {isRecording ? (
              <div>
                <p className="text-sm font-semibold text-[#DC143C] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse"></span>
                  Recording... Speak now in Nepali
                </p>
                <p className="text-xs text-gray-600 mt-1">Click the button again to stop</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Click to start voice recording
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Speak in Nepali (नेपाली) to report your issue
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-32 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-1">Transcript:</p>
            <p className="text-sm text-gray-800 leading-relaxed">{transcript}</p>
          </div>
        )}

        {transcript && !isRecording && (
          <button
            onClick={() => {
              if (onTranscript) onTranscript(transcript.trim());
              success("Transcript added to description!");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-semibold"
          >
            <CheckCircle className="w-4 h-4" />
            Use This Transcript
          </button>
        )}
      </div>
    </div>
  );
}

