"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { executeQuery, createSubscription, disposeWsClient } from "@/lib/fetcher"
import { ENDPOINTS, EXAMPLE_QUERIES, DEFAULT_QUERIES, type SchemaVersion } from "@/lib/config"

const VERSION_COLORS: Record<SchemaVersion, string> = {
  v1: "bg-[#1f6feb]",
  v3: "bg-[#238636]",
  v4: "bg-[#a371f7]",
}

const ALL_VERSIONS: SchemaVersion[] = ["v1", "v3", "v4"]

export function Playground({ version }: { version: SchemaVersion }) {
  const STORAGE_KEY = `midnight-playground-endpoint-${version}`
  const QUERY_STORAGE_KEY = `midnight-playground-query-${version}`
  const defaultEndpoint = ENDPOINTS[version].http
  const examples = EXAMPLE_QUERIES[version]
  const defaultQuery = DEFAULT_QUERIES[version]

  const [endpoint, setEndpoint] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || defaultEndpoint
    }
    return defaultEndpoint
  })

  // Derive WS endpoint from HTTP endpoint: http(s) → ws(s), append /ws
  const wsEndpoint = endpoint
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")
    .replace(/\/$/, "") + "/ws"

  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(QUERY_STORAGE_KEY) || defaultQuery
    }
    return defaultQuery
  })

  const [result, setResult] = useState("")
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
  }, [endpoint, query, isSubscription, isSubscribed, wsEndpoint])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleExecute()
      }
    },
    [handleExecute]
  )

  const otherVersions = ALL_VERSIONS.filter((v) => v !== version)

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9]">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-white m-0 whitespace-nowrap">
            Midnight Indexer
          </h1>
          <span
            className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${VERSION_COLORS[version]}`}
          >
            {version.toUpperCase()}
          </span>
        </div>

        <input
          type="url"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="GraphQL endpoint URL..."
          className="flex-1 max-w-[500px] px-3 py-1.5 rounded-md bg-[#0d1117] border border-[#30363d] text-white text-sm outline-none focus:border-[#58a6ff]"
        />

        <select
          onChange={(e) => {
            const selected = examples.find((q) => q.name === e.target.value)
            if (selected) setQuery(selected.query)
          }}
          className="px-3 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-sm cursor-pointer"
        >
          <option value="">Examples</option>
          {examples.map((q) => (
            <option key={q.name} value={q.name}>
              {q.name}
            </option>
          ))}
        </select>

        {otherVersions.map((v) => (
          <Link
            key={v}
            href={`/${v}`}
            className="px-3 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-sm no-underline hover:border-[#58a6ff] transition-colors"
          >
            {v.toUpperCase()}
          </Link>
        ))}
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Query panel */}
        <div className="flex-1 flex flex-col border-r border-[#30363d]">
          <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">QUERY</span>
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className={`px-4 py-1.5 rounded-md text-white text-xs font-semibold border-none flex items-center gap-1.5 ${
                isSubscribed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#238636] hover:bg-[#2ea043]"
              } ${isLoading ? "cursor-wait" : "cursor-pointer"} transition-colors`}
            >
              {isSubscribed ? "Stop" : isSubscription ? "Subscribe" : "Run"}
              <span className="opacity-70 text-[0.625rem]">Ctrl+Enter</span>
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 p-4 bg-[#0d1117] border-none text-[#c9d1d9] text-sm font-mono resize-none outline-none leading-relaxed"
          />
        </div>

        {/* Result panel */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <span className="text-xs text-[#8b949e]">RESULT</span>
            {isSubscribed && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Subscribed
              </span>
            )}
          </div>
          <pre
            className={`flex-1 p-4 m-0 bg-[#0d1117] text-sm font-mono overflow-auto leading-relaxed ${
              result.includes('"error"') ? "text-red-400" : "text-green-300"
            }`}
          >
            {isLoading ? "Loading..." : result || "// Results will appear here"}
          </pre>
        </div>
      </div>
    </div>
  )
}
