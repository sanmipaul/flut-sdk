import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import type { ResolvedFlutConfig } from './config';
import type { Vault } from './types/vault';

/** Fetch a single vault by ID. Returns null if not found. */
export async function fetchVault(
  config: ResolvedFlutConfig,
  vaultId: number,
): Promise<Vault | null> {
  try {
    const result = await callReadOnlyFunction({
      network: config.network,
      contractAddress: config.contractAddress,
      contractName: config.contractName,
      functionName: 'get-vault',
      functionArgs: [uintCV(vaultId)],
      senderAddress: config.contractAddress,
    });

    const json = cvToJSON(result);
    if (!json.value) return null;
    const v = json.value;

    return {
      vaultId,
      creator: v.creator?.value ?? '',
      amount: Number(v.amount?.value ?? 0),
      unlockHeight: Number(v['unlock-height']?.value ?? 0),
      createdAt: Number(v['created-at']?.value ?? 0),
      isWithdrawn: v['is-withdrawn']?.value === true,
      beneficiaries: [],
      stackingEnabled: v['stacking-enabled']?.value === true,
      stackingPool: v['stacking-pool']?.value ?? null,
    };
  } catch {
    return null;
  }
}

/** Get the total number of vaults created on the contract. */
export async function fetchVaultCount(config: ResolvedFlutConfig): Promise<number> {
  try {
    const result = await callReadOnlyFunction({
      network: config.network,
      contractAddress: config.contractAddress,
      contractName: config.contractName,
      functionName: 'get-vault-count',
      functionArgs: [],
      senderAddress: config.contractAddress,
    });
    const json = cvToJSON(result);
    return Number(json.value ?? 0);
  } catch {
    return 0;
  }
}

/** Fetch the current Stacks block height from the API. */
export async function fetchBlockHeight(config: ResolvedFlutConfig): Promise<number> {
  try {
    const res = await fetch(`${config.stacksApiUrl}/v2/info`);
    const data = await res.json();
    return Number(data.burn_block_height ?? data.stacks_tip_height ?? 0);
  } catch {
    return 0;
  }
}

/**
 * Fetch all vaults belonging to a given Stacks address.
 * Scans all vault IDs up to the current count.
 */
export async function fetchVaultsForUser(
  config: ResolvedFlutConfig,
  address: string,
): Promise<Vault[]> {
  const count = await fetchVaultCount(config);
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) => fetchVault(config, i)),
  );
  return results.filter((v): v is Vault => v !== null && v.creator === address);
}
