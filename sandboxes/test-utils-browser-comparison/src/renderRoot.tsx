import { createRoot } from "react-dom/client"
import { App } from "./App"

export const renderRoot = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  createRoot(document.getElementById("root")!).render(<App />)
}
