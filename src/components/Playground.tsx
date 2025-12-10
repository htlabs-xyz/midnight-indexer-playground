import { useState, useMemo, useCallback, useEffect } from "react"
import { GraphiQL } from "graphiql"
import { createFetcher, disposeWsClient } from "../lib/fetcher"
import "graphiql/graphiql.css"

const STORAGE_KEY = "midnight-playground-endpoint"
const DEFAULT_ENDPOINT = "https://indexer.testnet-02.midnight.network/api/v1/graphql"

const DEFAULT_QUERY = `# Midnight Indexer GraphQL Playground
#
# Enter your endpoint URL above and start querying!
#
# Example queries:

# Get latest block
query GetLatestBlock {
  block {
    hash
    height
    timestamp
    protocolVersion
  }
}

# Get block by height
# query GetBlockByHeight {
#   block(offset: { height: 100 }) {
#     hash
#     height
#     timestamp
#     transactions {
#       hash
#       id
#     }
#   }
# }

# Subscribe to new blocks
# subscription BlockSubscription {
#   blocks {
#     hash
#     height
#     timestamp
#   }
# }
`

export function Playground() {
  const [endpoint, setEndpoint] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_ENDPOINT
    }
    return DEFAULT_ENDPOINT
  })
  const [inputValue, setInputValue] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_ENDPOINT
    }
    return DEFAULT_ENDPOINT
  })
  const [isConnected, setIsConnected] = useState(false)

  const wsEndpoint = useMemo(() => {
    if (!endpoint) return undefined
    try {
      const url = new URL(endpoint)
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
      return url.toString()
    } catch {
      return undefined
    }
  }, [endpoint])

  const fetcher = useMemo(() => {
    if (!endpoint) return null
    return createFetcher(endpoint, wsEndpoint)
  }, [endpoint, wsEndpoint])

  const handleConnect = useCallback(() => {
    if (!inputValue.trim()) return
    try {
      new URL(inputValue)
      setEndpoint(inputValue)
      setIsConnected(true)
      localStorage.setItem(STORAGE_KEY, inputValue)
    } catch {
      alert("Invalid URL")
    }
  }, [inputValue])

  const handleDisconnect = useCallback(() => {
    disposeWsClient()
    setIsConnected(false)
    setEndpoint("")
  }, [])

  useEffect(() => {
    return () => disposeWsClient()
  }, [])

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0d1117" }}>
      <header style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d"
      }}>
        <h1 style={{ fontSize: "1.125rem", fontWeight: 600, color: "white", margin: 0 }}>
          Midnight Indexer Playground
        </h1>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="Enter GraphQL endpoint URL..."
            disabled={isConnected}
            style={{
              flex: 1,
              maxWidth: "36rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              backgroundColor: "#0d1117",
              border: "1px solid #30363d",
              color: "white",
              fontSize: "0.875rem",
              outline: "none",
              opacity: isConnected ? 0.5 : 1
            }}
          />
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              style={{
                padding: "0.375rem 1rem",
                borderRadius: "0.25rem",
                backgroundColor: "#dc2626",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer"
              }}
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={!inputValue.trim()}
              style={{
                padding: "0.375rem 1rem",
                borderRadius: "0.25rem",
                backgroundColor: "#238636",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                cursor: inputValue.trim() ? "pointer" : "not-allowed",
                opacity: inputValue.trim() ? 1 : 0.5
              }}
            >
              Connect
            </button>
          )}
        </div>
        {isConnected && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#4ade80" }}>
            <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "#4ade80" }}></span>
            Connected
          </span>
        )}
      </header>

      <main style={{ flex: 1, overflow: "hidden" }}>
        {fetcher && isConnected ? (
          <GraphiQL fetcher={fetcher} defaultQuery={DEFAULT_QUERY} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Welcome to Midnight Indexer Playground</p>
              <p style={{ fontSize: "0.875rem" }}>Enter a GraphQL endpoint URL above to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
