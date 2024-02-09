import React from "react";

type OpenAiTtsRequest = {
  input: string;
  model: string;
  voice: string;
};

export default function Content(): JSX.Element {
  const recorderRef = React.useRef<HTMLButtonElement>(null);
  const speakerRef = React.useRef<HTMLButtonElement>(null);

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
        if (response.status === 200) {
          addTextToPrompt(json.text);
        }
      })
      .catch((err) => {
        console.error("Error transcribing audio", err);
        alert("Error transcribing audio, check console for details.");
      });
  }

  function textToSpeech(text: string) {
    const apiKey = state.current.apiKey;
    const body: OpenAiTtsRequest = {
      input: text,
      model: "tts-1",
      voice: "alloy",
    };
    const headers = {
      accept: "audio/mpeg",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Security-Policy": "default-src 'self'; media-src *;",
    };
    fetch("https://api.openai.com/v1/audio/speech", {
      headers: headers,
      body: JSON.stringify(body),
      method: "POST",
    }).then(async (response) => {
      console.log(response);
      const blob = await response.blob();

      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    });
  }

  function addTextToPrompt(text: string) {
    const promptInput = document.querySelector("#prompt-textarea") as HTMLTextAreaElement;
    promptInput.value += text;
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
    const recorder = recorderRef.current;
    const speaker = speakerRef.current;
    if (!recorder || !speaker) {
      return;
    }

    loadApiKey();

    speaker.addEventListener("click", () => {
      const selection = window.getSelection();
      const text = selection?.toString();
      if (!text) {
        alert("Please select some text to speak");
        return;
      }
      textToSpeech(text);
    });

    recorder.addEventListener("click", () => {
      if (state.current.apiKey == "sk-" || !state.current.apiKey) {
        alert("Please set your OpenAI API key in the options page");
        return;
      }

      if (state.current.isRecording) {
        stopRecording();
        return;
      }

      initRecorder(recorder);
    });

    const rootContainer = document.querySelector("#main-root");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rootContainer?.parentElement?.appendChild(rootContainer.children[0]!);
  }, []);

  return (
    <div id="button-container" className="h-full flex absolute items-center justify-center right-0 mr-14">
      <button ref={speakerRef} id="prompt-speaker" className=" text-white font-bold py-2 px-4 w-8 h-8 contents">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124m5.393.984a.75.75 0 1 0-1.06 1.06a5.5 5.5 0 0 1 0 7.78a.75.75 0 1 0 1.06 1.06a7 7 0 0 0 0-9.9" />
          <path fill="currentColor" d="M10.828 5.172a.75.75 0 1 0-1.06 1.06a2.5 2.5 0 0 1 0 3.536a.75.75 0 1 0 1.06 1.06a4 4 0 0 0 0-5.656" />
        </svg>
      </button>
      <button ref={recorderRef} id="prompt-recorder" className=" text-white font-bold py-2 px-4 w-8 h-8 contents">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3" />
        </svg>
      </button>
    </div>
  );
}
