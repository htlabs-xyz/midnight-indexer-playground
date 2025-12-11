export const EXAMPLE_QUERIES_V3 = [
  {
    name: "Block (Latest)",
    query: `query GetLatestBlock {
  block {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
    transactions {
      id
      hash
      protocolVersion
      raw
    }
  }
}`
  },
  {
    name: "Block by Height",
    query: `query GetBlockByHeight {
  block(offset: { height: 100 }) {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
    parent {
      hash
      height
    }
    transactions {
      id
      hash
      protocolVersion
      raw
    }
  }
}`
  },
  {
    name: "Block by Hash",
    query: `query GetBlockByHash {
  block(offset: { hash: "YOUR_BLOCK_HASH" }) {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
  }
}`
  },
  {
    name: "Transaction by Hash",
    query: `query GetTransactionByHash {
  transactions(offset: { hash: "YOUR_TX_HASH" }) {
    id
    hash
    protocolVersion
    raw
    block {
      hash
      height
      timestamp
      ledgerParameters
    }
    contractActions {
      address
      state
      zswapState
      unshieldedBalances {
        tokenType
        amount
      }
    }
    unshieldedCreatedOutputs {
      owner
      tokenType
      value
      outputIndex
      intentHash
      ctime
      initialNonce
      registeredForDustGeneration
    }
    unshieldedSpentOutputs {
      owner
      tokenType
      value
      outputIndex
      intentHash
      ctime
      initialNonce
      registeredForDustGeneration
    }
    zswapLedgerEvents {
      id
      raw
      maxId
    }
    dustLedgerEvents {
      id
      raw
      maxId
    }
  }
}`
  },
  {
    name: "Transaction by Identifier",
    query: `query GetTransactionByIdentifier {
  transactions(offset: { identifier: "YOUR_TX_IDENTIFIER" }) {
    id
    hash
    protocolVersion
    raw
    block {
      hash
      height
      timestamp
      ledgerParameters
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
    zswapState
    transaction {
      id
      hash
      protocolVersion
    }
    unshieldedBalances {
      tokenType
      amount
    }
  }
}`
  },
  {
    name: "Contract Action at Block",
    query: `query GetContractActionAtBlock {
  contractAction(
    address: "YOUR_CONTRACT_ADDRESS"
    offset: { blockOffset: { height: 100 } }
  ) {
    address
    state
    zswapState
    transaction {
      id
      hash
    }
    unshieldedBalances {
      tokenType
      amount
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
    utxoTxHash
    utxoOutputIndex
  }
}`
  },
  {
    name: "Subscribe Blocks",
    query: `subscription BlockSubscription {
  blocks {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
    transactions {
      id
      hash
    }
  }
}`
  },
  {
    name: "Subscribe Blocks from Height",
    query: `subscription BlockSubscriptionFromHeight {
  blocks(offset: { height: 100 }) {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
  }
}`
  },
  {
    name: "Subscribe Contract Actions",
    query: `subscription ContractActionsSubscription {
  contractActions(address: "YOUR_CONTRACT_ADDRESS") {
    address
    state
    zswapState
    transaction {
      id
      hash
    }
    unshieldedBalances {
      tokenType
      amount
    }
  }
}`
  },
  {
    name: "Subscribe Zswap Events",
    query: `subscription ZswapLedgerEventsSubscription {
  zswapLedgerEvents {
    id
    raw
    maxId
  }
}`
  },
  {
    name: "Subscribe Dust Events",
    query: `subscription DustLedgerEventsSubscription {
  dustLedgerEvents {
    id
    raw
    maxId
  }
}`
  }
]

export const DEFAULT_QUERY_V3 = `query GetLatestBlock {
  block {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
    transactions {
      id
      hash
    }
  }
}`
