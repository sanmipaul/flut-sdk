# flut-sdk

TypeScript SDK for interacting with [Flut](https://github.com/YOUR_USERNAME/flut) vault contracts on the [Stacks](https://stacks.co) blockchain.

Flut lets users time-lock STX into on-chain vaults — this SDK exposes the contract's read functions, utility helpers, and types as a framework-agnostic package.

## Installation

```bash
npm install flut-sdk
```

## Quick start

```ts
import { createFlutConfig, fetchVault, fetchVaultsForUser, microToStx } from 'flut-sdk';

const config = createFlutConfig({
  network: 'mainnet',
  contractAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ',
});

// Fetch a single vault
const vault = await fetchVault(config, 0);
if (vault) {
  console.log(`Vault amount: ${microToStx(vault.amount)} STX`);
}

// Fetch all vaults for a user
const vaults = await fetchVaultsForUser(config, 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ');
console.log(`Found ${vaults.length} vault(s)`);
```

## API

### `createFlutConfig(options)`

Creates a resolved config object required by all SDK functions.

```ts
const config = createFlutConfig({
  network: 'mainnet',          // 'mainnet' | 'testnet'
  contractAddress: 'SP...',    // deployed contract principal
  contractName: 'flut',        // optional, default: 'flut'
  nftContractName: 'flut-nft', // optional, default: 'flut-nft'
  stacksApiUrl: 'https://...',  // optional, defaults to Hiro API
});
```

### Contract functions

| Function | Description |
|---|---|
| `fetchVault(config, vaultId)` | Fetch a single vault by numeric ID |
| `fetchVaultCount(config)` | Get the total number of vaults on-chain |
| `fetchBlockHeight(config)` | Get the current Stacks block height |
| `fetchVaultsForUser(config, address)` | Fetch all vaults belonging to an address |

### Vault helpers

```ts
import { getVaultStatus, blocksRemaining, blocksToMs } from 'flut-sdk';

getVaultStatus(vault, currentBlock);   // 'locked' | 'unlocked' | 'withdrawn'
blocksRemaining(vault, currentBlock);  // blocks left until unlock
blocksToMs(blocks);                    // estimated milliseconds
```

### Utilities

```ts
import { microToStx, stxToMicro, truncateAddress, formatStx } from 'flut-sdk';

microToStx(1_000_000);                // 1
stxToMicro(1);                        // 1000000n
truncateAddress('SP2J6Z...V9EJ', 6);  // 'SP2J6Z…RV9EJ'
formatStx(1_500_000);                 // '1.5 STX'
```

### Constants

```ts
import { DURATION_PRESETS, MIN_LOCK_BLOCKS, MAX_LOCK_BLOCKS, MS_PER_BLOCK } from 'flut-sdk';
```

| Constant | Value | Description |
|---|---|---|
| `MIN_LOCK_BLOCKS` | `144` | ~1 day |
| `MAX_LOCK_BLOCKS` | `262_800` | ~5 years |
| `MIN_AMOUNT_STX` | `1` | Minimum deposit |
| `MAX_AMOUNT_STX` | `1_000` | Contract limit per transaction |
| `MS_PER_BLOCK` | `600_000` | Milliseconds per Stacks block |

## Publishing

1. Add your `NPM_TOKEN` to GitHub repository secrets.
2. Create a GitHub release — the `publish` workflow will build and push to npm automatically.

## License

MIT
