/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";

export default function Modal(): JSX.Element {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(null);

  const state = React.useRef({
    isRecording: false,
    audioStream: null as MediaStream | null,
  });

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      //request audio
      if (state.current.isRecording) {
        console.log("Stopping audio stream");
        audioStream?.getTracks().forEach((track) => track.stop());
        button.style.color = "white";
        state.current.isRecording = false;
        return;
      }
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          button.style.color = "red";
          state.current.isRecording = true;
          state.current.audioStream = stream;
          console.log("Audio stream acquired");
        })
        .catch((err) => {
          alert("No microphone detected.");
          console.error("Error acquiring audio stream", err);
        });
    });

    const rootContainer = document.querySelector("#main-root");
    rootContainer?.parentElement?.appendChild(rootContainer.children[0]!);
  }, []);

  return (
    <div id="button-container" className="h-full flex absolute items-center justify-center right-0 mr-14">
      <button ref={buttonRef} id="prompt-button" className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-8 h-8 contents "}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3" />
        </svg>
      </button>
    </div>
  );
}
