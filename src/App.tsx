import { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import SwapInterface from './components/SwapInterface';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const App: FC = () => {
  // Set to 'mainnet-beta' for production
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
            <div className="container mx-auto px-4 py-8">
              <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">HotWings Token Swap</h1>
                <p className="text-lg opacity-80">Swap your HPT tokens for HotWings</p>
              </header>
              <SwapInterface />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;