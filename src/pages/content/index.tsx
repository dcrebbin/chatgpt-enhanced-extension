/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "@assets/styles/tailwind.css";
import Modal from "@pages/content/Modal";
import { createRoot } from "react-dom/client";

async function init() {
  //wait for render
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const promptInput = document.querySelector("#prompt-textarea");

  const promptContainer = promptInput?.parentElement;

  const mainRoot = document.createElement("div");
  mainRoot.id = "main-root";
  promptContainer?.appendChild(mainRoot);
  if (!promptContainer) {
    return;
  }
  const root = createRoot(mainRoot);
  root.render(<Modal />);
  //set child to parent
}

init();

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
