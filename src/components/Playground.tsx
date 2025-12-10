import { useState, useCallback, useEffect, useRef } from "react"
import { executeQuery, createSubscription, disposeWsClient } from "../lib/fetcher"
import { ENDPOINTS, EXAMPLE_QUERIES, DEFAULT_QUERIES, type SchemaVersion } from "../config"

type Props = {
  version: SchemaVersion
}

export function Playground({ version }: Props) {
  const STORAGE_KEY = `midnight-playground-endpoint-${version}`
  const QUERY_STORAGE_KEY = `midnight-playground-query-${version}`
  const defaultEndpoint = ENDPOINTS[version].http
  const defaultWsEndpoint = ENDPOINTS[version].ws
  const examples = EXAMPLE_QUERIES[version]
  const defaultQuery = DEFAULT_QUERIES[version]

  const [endpoint, setEndpoint] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || defaultEndpoint
    }
    return defaultEndpoint
  })

  const wsEndpoint = defaultWsEndpoint
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(QUERY_STORAGE_KEY) || defaultQuery
    }
    return defaultQuery
  })
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, endpoint)
  }, [endpoint, STORAGE_KEY])

  useEffect(() => {
    localStorage.setItem(QUERY_STORAGE_KEY, query)
  }, [query, QUERY_STORAGE_KEY])

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      disposeWsClient()
    }
  }, [])

  const isSubscription = query.trim().toLowerCase().startsWith("subscription")

  const handleExecute = useCallback(async () => {
    if (isSubscribed && unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
      setIsSubscribed(false)
      setResult("")
      return
    }

    setIsLoading(true)
    setResult("")

    try {
      if (isSubscription) {
        setIsSubscribed(true)
        const results: unknown[] = []

        unsubscribeRef.current = createSubscription(
          wsEndpoint,
          query,
          undefined,
          (data) => {
            results.push(data)
            setResult(JSON.stringify(results.slice(-10), null, 2))
          },
          (error) => {
            setResult(JSON.stringify({ error: String(error) }, null, 2))
            setIsSubscribed(false)
          },
          () => {
            setIsSubscribed(false)
          }
        )
        setIsLoading(false)
      } else {
        const response = await executeQuery(endpoint, query)
        setResult(JSON.stringify(response, null, 2))
        setIsLoading(false)
      }
    } catch (error) {
      setResult(JSON.stringify({ error: String(error) }, null, 2))
      setIsLoading(false)
      setIsSubscribed(false)
    }
  }, [endpoint, query, isSubscription, isSubscribed])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleExecute()
    }
  }, [handleExecute])

  const otherVersion = version === "v1" ? "v3" : "v1"

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0d1117", color: "#c9d1d9" }}>
      <header style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h1 style={{ fontSize: "1rem", fontWeight: 600, color: "white", margin: 0, whiteSpace: "nowrap" }}>
            Midnight Indexer
          </h1>
          <span style={{
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            backgroundColor: version === "v3" ? "#238636" : "#1f6feb",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600
          }}>
            {version.toUpperCase()}
          </span>
        </div>
        <input
          type="url"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="GraphQL endpoint URL..."
          style={{
            flex: 1,
            maxWidth: "500px",
            padding: "0.375rem 0.75rem",
            borderRadius: "0.375rem",
            backgroundColor: "#0d1117",
            border: "1px solid #30363d",
            color: "white",
            fontSize: "0.875rem",
            outline: "none"
          }}
        />
        <select
          onChange={(e) => {
            const selected = examples.find(q => q.name === e.target.value)
            if (selected) setQuery(selected.query)
          }}
          style={{
            padding: "0.375rem 0.75rem",
            borderRadius: "0.375rem",
            backgroundColor: "#21262d",
            border: "1px solid #30363d",
            color: "#c9d1d9",
            fontSize: "0.875rem",
            cursor: "pointer"
          }}
        >
          <option value="">Examples</option>
          {examples.map(q => (
            <option key={q.name} value={q.name}>{q.name}</option>
          ))}
        </select>
        <a
          href={`/${otherVersion}`}
          style={{
            padding: "0.375rem 0.75rem",
            borderRadius: "0.375rem",
            backgroundColor: "#21262d",
            border: "1px solid #30363d",
            color: "#c9d1d9",
            fontSize: "0.875rem",
            textDecoration: "none"
          }}
        >
          Switch to {otherVersion.toUpperCase()}
        </a>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #30363d" }}>
          <div style={{ padding: "0.5rem 1rem", backgroundColor: "#161b22", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: "#8b949e" }}>QUERY</span>
            <button
              onClick={handleExecute}
              disabled={isLoading}
              style={{
                padding: "0.375rem 1rem",
                borderRadius: "0.375rem",
                backgroundColor: isSubscribed ? "#dc2626" : "#238636",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
                border: "none",
                cursor: isLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem"
              }}
            >
              {isSubscribed ? "Stop" : isSubscription ? "Subscribe" : "Run"}
              <span style={{ opacity: 0.7, fontSize: "0.625rem" }}>Ctrl+Enter</span>
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#0d1117",
              border: "none",
              color: "#c9d1d9",
              fontSize: "0.875rem",
              fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
              resize: "none",
              outline: "none",
              lineHeight: 1.5
            }}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0.5rem 1rem", backgroundColor: "#161b22", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: "#8b949e" }}>RESULT</span>
            {isSubscribed && (
              <span style={{ fontSize: "0.75rem", color: "#4ade80", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: "#4ade80" }}></span>
                Subscribed
              </span>
            )}
          </div>
          <pre style={{
            flex: 1,
            padding: "1rem",
            margin: 0,
            backgroundColor: "#0d1117",
            color: result.includes('"error"') ? "#f85149" : "#7ee787",
            fontSize: "0.875rem",
            fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
            overflow: "auto",
            lineHeight: 1.5
          }}>
            {isLoading ? "Loading..." : result || "// Results will appear here"}
          </pre>
        </div>
      </div>
    </div>
  )
}
