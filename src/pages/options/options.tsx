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

  const restoreOptions = () => {
    chrome.storage.sync.get({ apiKey: "sk-" }, (items) => {
      apiKeyRef.current!.value = items.apiKey;
    });
  };
  const iconUrl = chrome.runtime.getURL("icon128.png");
  const exampleUrl = chrome.runtime.getURL("example.png");
  const apiKeyRef = React.createRef<HTMLInputElement>();
  const statusRef = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    restoreOptions();
  }, []);

  function MdiGithub(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
      </svg>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", height: "15rem", backgroundColor: "#F5F5EE", paddingLeft: "5rem", paddingRight: "5rem", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={iconUrl} alt="icon" style={{ width: "3rem", height: "3rem" }} />
          <h1 style={{ fontSize: "medium", paddingBottom: "1px", borderBottom: "2px solid", fontWeight: "500" }}>Options</h1>
        </div>
        <a href="https://github.com/dcrebbin/chatgpt-enhanced-extension" style={{ display: "flex", alignItems: "center", fontSize: "large", textDecoration: "auto", color: "black" }}>
          <p style={{ fontWeight: "500" }}>Opensource</p>
          <MdiGithub></MdiGithub>
        </a>
      </div>
      <main style={{ width: "100%", display: "flex", height: "100%", backgroundColor: "white" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", margin: "5rem", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.5rem", fontSize: "large" }}>
              <h1 style={{ margin: 0 }}>ChatGPT</h1>
              <h1 style={{ margin: 0, color: "#FB651E" }}>Enhanced</h1>
            </div>
            <h2 style={{ margin: 0, fontWeight: "500" }}>Options</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "2rem", alignItems: "center" }}>
            <label htmlFor="apiKey" style={{ color: "black", fontSize: "large", fontWeight: "bold", display: "flex", gap: "0.2rem" }}>
              <h3 style={{ color: "#FB651E" }}>OpenAI</h3>
              <h3>Key*</h3>
            </label>
            <input style={{ color: "black", background: "#F5F5EE", borderRadius: "0.375rem", padding: "5px", width: "31.5rem" }} type="text" id="apiKey" ref={apiKeyRef} />
          </div>
          <button onClick={saveOptions} style={{ backgroundColor: "#FDA942", color: "white", paddingLeft: "2rem", paddingRight: "2rem", height: "2rem", cursor: "pointer" }}>
            Save
          </button>
          <div ref={statusRef} style={{ color: "green", fontWeight: "bold" }}></div>
        </div>
        <div style={{ backgroundColor: "black", width: "100%", margin: "5rem" }}>
          <img src={exampleUrl} alt="example" style={{ width: "100%", height: "auto" }} />
        </div>
      </main>
      <footer style={{ width: "100%", display: "flex", height: "10rem", backgroundColor: "#F5F5EE", paddingLeft: "5rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "2px", alignItems: "center", fontSize: "medium" }}>
          <p>*Get your api key from:</p>
          <a href="https://platform.openai.com/" style={{ color: "black", textDecoration: "auto", fontWeight: "bold" }}>
            platform.openai.com
          </a>
        </div>
      </footer>
    </div>
  );
}
