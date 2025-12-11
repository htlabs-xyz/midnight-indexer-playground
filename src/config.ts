import { EXAMPLE_QUERIES_V1, DEFAULT_QUERY_V1 } from "./queries/v1"
import { EXAMPLE_QUERIES_V3, DEFAULT_QUERY_V3 } from "./queries/v3"

export type SchemaVersion = "v1" | "v3"

export const ENDPOINTS = {
  v1: {
    http: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
    ws: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  },
  v3: {
    http: "https://indexer-testnet.nocturne.cash/api/v3/graphql",
    ws: "wss://indexer-testnet.nocturne.cash/api/v3/graphql/ws",
  },
}

export const EXAMPLE_QUERIES = {
  v1: EXAMPLE_QUERIES_V1,
  v3: EXAMPLE_QUERIES_V3,
}

export const DEFAULT_QUERIES = {
  v1: DEFAULT_QUERY_V1,
  v3: DEFAULT_QUERY_V3,
}
