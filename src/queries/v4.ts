export const EXAMPLE_QUERIES_V4 = [
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
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
      termsAndConditions {
        hash
        url
      }
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
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
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
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
    }
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
      protocolVersion
    }
    dustLedgerEvents {
      id
      raw
      maxId
      protocolVersion
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
      protocolVersion
    }
    dustLedgerEvents {
      id
      raw
      maxId
      protocolVersion
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
    name: "D-Parameter History",
    query: `query GetDParameterHistory {
  dParameterHistory {
    blockHeight
    blockHash
    timestamp
    numPermissionedCandidates
    numRegisteredCandidates
  }
}`
  },
  {
    name: "Terms & Conditions History",
    query: `query GetTermsAndConditionsHistory {
  termsAndConditionsHistory {
    blockHeight
    blockHash
    timestamp
    hash
    url
  }
}`
  },
  {
    name: "SPO Identities",
    query: `query GetSpoIdentities {
  spoIdentities(limit: 10, offset: 0) {
    poolIdHex
    mainchainPubkeyHex
    sidechainPubkeyHex
    auraPubkeyHex
    validatorClass
  }
}`
  },
  {
    name: "SPO by Pool ID",
    query: `query GetSpoByPoolId {
  spoByPoolId(poolIdHex: "YOUR_POOL_ID_HEX") {
    poolIdHex
    validatorClass
    sidechainPubkeyHex
    auraPubkeyHex
    name
    ticker
    homepageUrl
    logoUrl
  }
}`
  },
  {
    name: "SPO List (Search)",
    query: `query GetSpoList {
  spoList(limit: 10, offset: 0, search: "") {
    poolIdHex
    validatorClass
    sidechainPubkeyHex
    auraPubkeyHex
    name
    ticker
    homepageUrl
    logoUrl
  }
}`
  },
  {
    name: "SPO Composite",
    query: `query GetSpoComposite {
  spoCompositeByPoolId(poolIdHex: "YOUR_POOL_ID_HEX") {
    identity {
      poolIdHex
      mainchainPubkeyHex
      sidechainPubkeyHex
      validatorClass
    }
    metadata {
      poolIdHex
      name
      ticker
      homepageUrl
      logoUrl
    }
    performance {
      epochNo
      produced
      expected
      stakeSnapshot
    }
  }
}`
  },
  {
    name: "SPO Count",
    query: `query GetSpoCount {
  spoCount
}`
  },
  {
    name: "Pool Metadata",
    query: `query GetPoolMetadata {
  poolMetadata(poolIdHex: "YOUR_POOL_ID_HEX") {
    poolIdHex
    hexId
    name
    ticker
    homepageUrl
    logoUrl
  }
}`
  },
  {
    name: "Pool Metadata List",
    query: `query GetPoolMetadataList {
  poolMetadataList(limit: 10, offset: 0, withNameOnly: true) {
    poolIdHex
    hexId
    name
    ticker
    homepageUrl
    logoUrl
  }
}`
  },
  {
    name: "Current Epoch Info",
    query: `query GetCurrentEpochInfo {
  currentEpochInfo {
    epochNo
    durationSeconds
    elapsedSeconds
  }
}`
  },
  {
    name: "Epoch Performance",
    query: `query GetEpochPerformance {
  epochPerformance(epoch: 1, limit: 10, offset: 0) {
    epochNo
    spoSkHex
    produced
    expected
    identityLabel
    stakeSnapshot
    poolIdHex
    validatorClass
  }
}`
  },
  {
    name: "Epoch Utilization",
    query: `query GetEpochUtilization {
  epochUtilization(epoch: 1)
}`
  },
  {
    name: "Committee",
    query: `query GetCommittee {
  committee(epoch: 1) {
    epochNo
    position
    sidechainPubkeyHex
    expectedSlots
    auraPubkeyHex
    poolIdHex
    spoSkHex
  }
}`
  },
  {
    name: "Stake Distribution",
    query: `query GetStakeDistribution {
  stakeDistribution(limit: 10, offset: 0, orderByStakeDesc: true) {
    poolIdHex
    name
    ticker
    liveStake
    activeStake
    liveDelegators
    liveSaturation
    declaredPledge
    livePledge
    stakeShare
  }
}`
  },
  {
    name: "Registration Totals Series",
    query: `query GetRegisteredTotalsSeries {
  registeredTotalsSeries(fromEpoch: 1, toEpoch: 10) {
    epochNo
    totalRegistered
    newlyRegistered
  }
}`
  },
  {
    name: "Registration SPO Series",
    query: `query GetRegisteredSpoSeries {
  registeredSpoSeries(fromEpoch: 1, toEpoch: 10) {
    epochNo
    federatedValidCount
    federatedInvalidCount
    registeredValidCount
    registeredInvalidCount
    dparam
  }
}`
  },
  {
    name: "Subscribe Unshielded Transactions by Address",
    query: `subscription UnshieldedTransactionsByAddress {
  unshieldedTransactions(address: "mn_addr_preview1") {
    ... on UnshieldedTransaction {
      transaction {
        id
        hash
        protocolVersion
        block {
          hash
          height
          timestamp
        }
      }
      createdUtxos {
        owner
        tokenType
        value
        outputIndex
        intentHash
        ctime
        initialNonce
        registeredForDustGeneration
      }
      spentUtxos {
        owner
        tokenType
        value
        outputIndex
        intentHash
        ctime
        initialNonce
        registeredForDustGeneration
      }
    }
    ... on UnshieldedTransactionsProgress {
      highestTransactionId
    }
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
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
    }
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
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
    }
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
    protocolVersion
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
    protocolVersion
  }
}`
  }
]

export const DEFAULT_QUERY_V4 = `query GetLatestBlock {
  block {
    hash
    height
    protocolVersion
    timestamp
    author
    ledgerParameters
    systemParameters {
      dParameter {
        numPermissionedCandidates
        numRegisteredCandidates
      }
      termsAndConditions {
        hash
        url
      }
    }
    transactions {
      id
      hash
    }
  }
}`
