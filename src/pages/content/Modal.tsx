/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";

export default function Modal(): JSX.Element {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const state = React.useRef({
    isRecording: false,
    apiKey: "",
    audioChunks: [] as Blob[],
    audioStream: null as MediaStream | null,
    mediaRecorder: null as MediaRecorder | null,
  });

  function whisperRequest(blob: Blob[]) {
    const formData = new FormData();
    const audioBlob = new Blob(blob, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const apiKey = state.current.apiKey;
    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })
      .then(async (response) => {
        console.log(response);
        const json = await response.json();
        console.log(json.text);
        alert(json.text);
      })
      .catch((err) => {
        console.error("Error transcribing audio", err);
        alert("Error transcribing audio, check console for details.");
      });
  }

  function initRecorder(button: HTMLButtonElement) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        button.style.color = "red";
        state.current.isRecording = true;
        state.current.audioStream = stream;
        state.current.mediaRecorder = new MediaRecorder(stream);
        state.current.audioChunks = [];
        state.current.mediaRecorder.start();

        state.current.mediaRecorder.ondataavailable = (e) => {
          state.current.audioChunks.push(e.data);
        };

        state.current.mediaRecorder.onstop = () => {
          console.log("Audio recording stopped");
          button.style.color = "white";
          const audioBlob = new Blob(state.current.audioChunks, { type: "audio/wav" });
          whisperRequest([audioBlob]);
        };
      })
      .catch((err) => {
        alert("No microphone detected.");
        console.error("Error acquiring audio stream", err);
      });
  }

  function loadApiKey() {
    chrome.storage.sync.get({ apiKey: "" }, function (items) {
      console.log("ApiKey:", items.apiKey);
      state.current.apiKey = items.apiKey;
    });
  }

  function stopRecording() {
    console.log("Stopping audio stream");
    state.current.audioStream?.getTracks().forEach((track) => track.stop());
    state.current.isRecording = false;
    state.current.mediaRecorder?.stop();
  }

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }

    loadApiKey();

    button.addEventListener("click", () => {
      if (state.current.apiKey == "sk-" || !state.current.apiKey) {
        alert("Please set your OpenAI API key in the options page");
        return;
      }

      if (state.current.isRecording) {
        stopRecording(button);
        return;
      }

      initRecorder(button);
    });

    const rootContainer = document.querySelector("#main-root");
    rootContainer?.parentElement?.appendChild(rootContainer.children[0]!);
  }, []);

  return (
    <div id="button-container" className="h-full flex absolute items-center justify-center right-0 mr-14">
      <button ref={buttonRef} id="prompt-button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-8 h-8 contents ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3" />
        </svg>
      </button>
    </div>
  );
}
