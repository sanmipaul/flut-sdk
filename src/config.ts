export type NetworkName = 'mainnet' | 'testnet';

export interface FlutConfig {
  network: NetworkName;
  contractAddress: string;
  contractName?: string;
  nftContractName?: string;
  stacksApiUrl?: string;
}

const DEFAULT_CONTRACT_NAME = 'flut';
const DEFAULT_NFT_CONTRACT_NAME = 'flut-nft';
const MAINNET_API = 'https://api.hiro.so';
const TESTNET_API = 'https://api.testnet.hiro.so';

/**
 * Create a resolved Flut config object from user-supplied options.
 * Pass the returned object into any SDK function that requires a config.
 */
export function createFlutConfig(config: FlutConfig) {
  const contractName = config.contractName ?? DEFAULT_CONTRACT_NAME;
  const nftContractName = config.nftContractName ?? DEFAULT_NFT_CONTRACT_NAME;
  const stacksApiUrl =
    config.stacksApiUrl ?? (config.network === 'mainnet' ? MAINNET_API : TESTNET_API);

  return {
    network: config.network as NetworkName,
    contractAddress: config.contractAddress,
    contractName,
    nftContractName,
    stacksApiUrl,
    contractId: `${config.contractAddress}.${contractName}`,
    nftContractId: `${config.contractAddress}.${nftContractName}`,
  };
}

export type ResolvedFlutConfig = ReturnType<typeof createFlutConfig>;
