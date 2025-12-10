import { createGraphiQLFetcher, type Fetcher } from "@graphiql/toolkit"
import { createClient, type Client } from "graphql-ws"

let wsClient: Client | null = null

export function createFetcher(endpoint: string, wsEndpoint?: string): Fetcher {
  if (wsClient) {
    wsClient.dispose()
    wsClient = null
  }

  const options: Parameters<typeof createGraphiQLFetcher>[0] = {
    url: endpoint,
  }

  if (wsEndpoint) {
    wsClient = createClient({
      url: wsEndpoint,
      retryAttempts: 3,
    })
    options.wsClient = wsClient
  }

  return createGraphiQLFetcher(options)
}

export function disposeWsClient() {
  if (wsClient) {
    wsClient.dispose()
    wsClient = null
  }
}
