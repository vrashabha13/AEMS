import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export default function VoiceInput({ onTranscript, language = 'en-US' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return (
      <div className="text-red-500">
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  return (
    <button
      onClick={toggleListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${isListening
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}
    >
      {isListening ? (
        <>
          <MicOff className="h-5 w-5" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-5 w-5" />
          Start Recording
        </>
      )}
    </button>
  );
}

export { VoiceInput }