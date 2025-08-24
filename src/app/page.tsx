"use client";

import { useState, useRef } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "tl", label: "Tagalog" },
];

export default function Home() {
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("es");
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const handleStart = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = inputLang;
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTranslate = async () => {
    if (!transcript) return;
    setIsTranslating(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          targetLang: outputLang,
        }),
      });

      const data = await res.json();
      setTranslated(data.translation);
    } catch (err) {
      console.error("Translation error:", err);
      setTranslated("Error translating text.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = () => {
    if (!translated) return;
    const utterance = new SpeechSynthesisUtterance(translated);
    utterance.lang = outputLang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Healthcare Translator
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Language
              </label>
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Language
              </label>
              <select
                value={outputLang}
                onChange={(e) => setOutputLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recording Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Speech Input
          </h2>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleStart}
              disabled={isRecording}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isRecording ? "Recording..." : "Start Recording"}
            </button>
            
            <button
              onClick={handleStop}
              disabled={!isRecording}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Stop Recording
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
            <h3 className="font-medium text-gray-700 mb-2">Transcript:</h3>
            <p className="text-gray-600">
              {transcript || "Click 'Start Recording' and speak..."}
            </p>
          </div>
        </div>

        {/* Translation Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Translation</h2>
            <button
              onClick={handleTranslate}
              disabled={!transcript || isTranslating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
            <h3 className="font-medium text-gray-700 mb-2">Translation:</h3>
            <p className="text-gray-600">
              {translated || "Translation will appear here..."}
            </p>
          </div>

          {translated && (
            <button
              onClick={handleSpeak}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔊 Speak Translation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}