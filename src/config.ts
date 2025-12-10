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
  v1: [
    {
      name: "Latest Block",
      query: `query GetLatestBlock {
  block {
    hash
    height
    timestamp
    protocolVersion
    author
  }
}`
    },
    {
      name: "Block by Height",
      query: `query GetBlockByHeight {
  block(offset: { height: 100 }) {
    hash
    height
    timestamp
    transactions {
      hash
      id
    }
  }
}`
    },
    {
      name: "Contract Action",
      query: `query GetContractAction {
  contractAction(address: "YOUR_CONTRACT_ADDRESS") {
    address
    state
    chainState
  }
}`
    },
    {
      name: "Subscribe Blocks",
      query: `subscription BlockSubscription {
  blocks {
    hash
    height
    timestamp
  }
}`
    }
  ],
  v3: [
    {
      name: "Latest Block",
      query: `query GetLatestBlock {
  block {
    hash
    height
    timestamp
    protocolVersion
    author
    ledgerParameters
  }
}`
    },
    {
      name: "Block by Height",
      query: `query GetBlockByHeight {
  block(offset: { height: 100 }) {
    hash
    height
    timestamp
    ledgerParameters
    transactions {
      hash
      id
    }
  }
}`
    },
    {
      name: "DUST Generation Status",
      query: `query GetDustGenerationStatus {
  dustGenerationStatus(
    cardanoRewardAddresses: ["stake_test1..."]
  ) {
    cardanoRewardAddress
    dustAddress
    registered
    nightBalance
    generationRate
    maxCapacity
    currentCapacity
  }
}`
    },
    {
      name: "Contract Action",
      query: `query GetContractAction {
  contractAction(address: "YOUR_CONTRACT_ADDRESS") {
    address
    state
    zswapState
  }
}`
    },
    {
      name: "Subscribe Blocks",
      query: `subscription BlockSubscription {
  blocks {
    hash
    height
    timestamp
    ledgerParameters
  }
}`
    }
  ]
}

export const DEFAULT_QUERIES = {
  v1: `# Midnight Indexer v1 Playground
# Testnet-02

query GetLatestBlock {
  block {
    hash
    height
    timestamp
    protocolVersion
    author
  }
}`,
  v3: `# Midnight Indexer v3 Playground
# Testnet-03

query GetLatestBlock {
  block {
    hash
    height
    timestamp
    protocolVersion
    author
    ledgerParameters
  }
}`
}
