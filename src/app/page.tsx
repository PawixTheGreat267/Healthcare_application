"use client";

import { useState } from "react";
import { useSpeechRecognition } from "react-speech-kit";

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

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => setTranscript(result),
    lang: inputLang,
  });

  const handleStart = () => {
    setIsRecording(true);
    listen();
  };

  const handleStop = () => {
    setIsRecording(false);
    stop();
  };

  const handleTranslate = async () => {
    if (!transcript) return;
    setIsTranslating(true);

    try {
      const res = await fetch("/src/api/pages/translate.ts", {
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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 gap-6">
      <h1 className="text-3xl font-bold text-blue-600">
        Healthcare Translator 🩺
      </h1>

      <div className="flex gap-4">
        <div>
          <label>Input Language:</label>
          <select
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Output Language:</label>
          <select
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Stop Recording
          </button>
        )}

        <button
          onClick={handleTranslate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isTranslating ? "Translating..." : "Translate"}
        </button>

        <button
          onClick={handleSpeak}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Speak
        </button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="font-semibold">Original Transcript:</h2>
        <p className="p-2 bg-white border rounded min-h-[50px]">{transcript}</p>

        <h2 className="font-semibold mt-4">Translated Text:</h2>
        <p className="p-2 bg-white border rounded min-h-[50px]">{translated}</p>
      </div>
    </main>
  );
}
