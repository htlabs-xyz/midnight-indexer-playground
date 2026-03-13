import home from "./src/index.html"
import v1 from "./src/v1.html"
import v3 from "./src/v3.html"
import v4 from "./src/v4.html"

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": home,
    "/v1": v1,
    "/v3": v3,
    "/v4": v4,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Server running at http://localhost:${server.port}`)
