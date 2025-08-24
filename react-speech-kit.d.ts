declare module 'react-speech-kit' {
  export interface SpeechRecognitionOptions {
    onResult?: (result: string) => void;
    lang?: string;
  }

  export interface SpeechRecognitionHook {
    listen: () => void;
    stop: () => void;
    isListening: boolean;
  }

  export function useSpeechRecognition(
    options?: SpeechRecognitionOptions
  ): SpeechRecognitionHook;
}