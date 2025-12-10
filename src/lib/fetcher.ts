import { createClient, type Client } from "graphql-ws"

let wsClient: Client | null = null

type GraphQLResponse = {
  data?: unknown
  errors?: Array<{ message: string }>
}

export async function executeQuery(
  endpoint: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}

export function createSubscription(
  wsEndpoint: string,
  query: string,
  variables: Record<string, unknown> | undefined,
  onData: (data: unknown) => void,
  onError: (error: unknown) => void,
  onComplete: () => void
): () => void {
  if (wsClient) {
    wsClient.dispose()
  }

  wsClient = createClient({
    url: wsEndpoint,
    retryAttempts: 3,
  })

  const unsubscribe = wsClient.subscribe(
    { query, variables },
    {
      next: (result) => onData(result),
      error: onError,
      complete: onComplete,
    }
  )

  return () => {
    unsubscribe()
    if (wsClient) {
      wsClient.dispose()
      wsClient = null
    }
  }
}

export function disposeWsClient() {
  if (wsClient) {
    wsClient.dispose()
    wsClient = null
  }
}
