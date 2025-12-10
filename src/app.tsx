import { createRoot } from "react-dom/client"
import { Playground } from "./components/Playground"
import type { SchemaVersion } from "./config"

const version = (window as unknown as { SCHEMA_VERSION?: SchemaVersion }).SCHEMA_VERSION || "v1"
const root = createRoot(document.getElementById("root")!)
root.render(<Playground version={version} />)
