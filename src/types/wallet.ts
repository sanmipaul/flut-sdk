export interface WalletState {
  connected: boolean;
  address: string | null;
  stxBalance: number | null;
  /** true while balance is being fetched */
  loading: boolean;
}

export interface ConnectOptions {
  appName?: string;
  appIcon?: string;
}
