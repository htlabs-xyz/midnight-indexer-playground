import { createRoot } from "react-dom/client"
import { Playground } from "./components/Playground"

const root = createRoot(document.getElementById("root")!)
root.render(<Playground />)
