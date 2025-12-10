import { useState, useMemo, useCallback, useEffect } from "react"
import { GraphiQL } from "graphiql"
import { createFetcher, disposeWsClient } from "../lib/fetcher"
import "graphiql/graphiql.css"

const STORAGE_KEY = "midnight-playground-endpoint"

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
      return localStorage.getItem(STORAGE_KEY) || ""
    }
    return ""
  })
  const [inputValue, setInputValue] = useState(endpoint)
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
    <div className="h-screen flex flex-col bg-[#0d1117]">
      <header className="flex items-center gap-4 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <h1 className="text-lg font-semibold text-white">
          Midnight Indexer Playground
        </h1>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="url"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="Enter GraphQL endpoint URL..."
            disabled={isConnected}
            className="flex-1 max-w-xl px-3 py-1.5 rounded bg-[#0d1117] border border-[#30363d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#58a6ff] disabled:opacity-50"
          />
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={!inputValue.trim()}
              className="px-4 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect
            </button>
          )}
        </div>
        {isConnected && (
          <span className="flex items-center gap-1.5 text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Connected
          </span>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        {fetcher && isConnected ? (
          <GraphiQL fetcher={fetcher} defaultQuery={DEFAULT_QUERY} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-xl mb-2">Welcome to Midnight Indexer Playground</p>
              <p className="text-sm">Enter a GraphQL endpoint URL above to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
