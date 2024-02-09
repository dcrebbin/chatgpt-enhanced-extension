import { createRoot } from "react-dom/client";
import Options from "./options";
//Until I figure out the csp issue
import "./index.css";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Options root element");
  const root = createRoot(rootContainer);
  root.render(<Options />);
}

init();
