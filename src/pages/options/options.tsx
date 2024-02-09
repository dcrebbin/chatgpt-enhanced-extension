//chrome options page

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";

export default function Options(): JSX.Element {
  const saveOptions = () => {
    const apiKey = apiKeyRef.current!.value;
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      const status = statusRef.current!;
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    });
  };

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get({ apiKey: "sk-" }, (items) => {
      apiKeyRef.current!.value = items.apiKey;
    });
  };

  const apiKeyRef = React.createRef<HTMLInputElement>();
  const statusRef = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    restoreOptions();
  }, []);

  return (
    <div className="container">
      <h1>Up It Quest Options</h1>
      <div>
        <label htmlFor="color">OpenAI API Key (from https://platform.openai.com/)</label>
        <input ref={apiKeyRef} type="text" id="color" />
        <button onClick={saveOptions}>Save</button>
      </div>
      <div ref={statusRef} id="status"></div>
    </div>
  );
}
