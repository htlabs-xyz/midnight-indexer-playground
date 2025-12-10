# Midnight Indexer Playground

A GraphQL IDE for querying Midnight blockchain indexer endpoints.

## Features

- Interactive GraphQL query editor with syntax highlighting
- Schema documentation explorer
- Query history
- WebSocket subscription support
- Dark theme UI
- Configurable endpoint URL
- Endpoint persistence in localStorage

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:3000
```

## Usage

1. Enter your Midnight indexer GraphQL endpoint URL
2. Click "Connect"
3. Write and execute queries

## Example Queries

```graphql
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
query GetBlockByHeight {
  block(offset: { height: 100 }) {
    hash
    height
    timestamp
    transactions {
      hash
      id
    }
  }
}

# Subscribe to new blocks
subscription BlockSubscription {
  blocks {
    hash
    height
    timestamp
  }
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with HMR |
| `bun run build` | Build for production |
| `bun run start` | Start production server |

## Tech Stack

- Bun (runtime + bundler)
- React 19
- GraphiQL
- graphql-ws (subscriptions)
- Tailwind CSS 4
