import React, { useState, useEffect } from 'react';
// import { Connection, PublicKey, clusterApiUrl, Transaction, TransactionInstruction } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } from '@solana/spl-token';
import { WalletProvider, useWallet, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './App.css';
import BN from 'bn.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// const programId = new PublicKey('YOUR_PROGRAM_ID');
// const hptMint = new PublicKey('YOUR_HPT_MINT_ADDRESS');
// const hotwingsMint = new PublicKey('YOUR_HOTWINGS_MINT_ADDRESS');
// const swapState = new PublicKey('YOUR_SWAP_STATE_ADDRESS');
// const hptVault = new PublicKey('YOUR_HPT_VAULT_ADDRESS');
// const hotwingsVault = new PublicKey('YOUR_HOTWINGS_VAULT_ADDRESS');

function App() {
    // const { publicKey, sendTransaction, connected } = useWallet();
    // const [amount, setAmount] = useState('');
    // const [status, setStatus] = useState('');
    // const [hptBalance, setHptBalance] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const endpoint = clusterApiUrl('devnet');
    // const connection = new Connection(endpoint, 'processed');

    // useEffect(() => {
    //     const fetchBalance = async () => {
    //         if (!publicKey) return;
    //         try {
    //             const hptAccount = await getAssociatedTokenAddress(hptMint, publicKey);
    //             const accountInfo = await getAccount(connection, hptAccount);
    //             setHptBalance(accountInfo.amount.toString());
    //         } catch (error) {
    //             setHptBalance(null);
    //             console.error('Failed to fetch balance:', error);
    //         }
    //     };

    //     if (connected) {
    //         fetchBalance();
    //     } else {
    //         setHptBalance(null);
    //     }
    // }, [publicKey, connected, connection]);

    // const swapTokens = async () => {
    //     if (!publicKey || !amount) return;
    //     setIsLoading(true);
    //     setStatus('Processing...');
    //     try {
    //         const swapperHptAccount = await getAssociatedTokenAddress(hptMint, publicKey);
    //         const swapperHotwingsAccount = await getAssociatedTokenAddress(hotwingsMint, publicKey);

    //         const transaction = new Transaction();
    //         try {
    //             await connection.getAccountInfo(swapperHotwingsAccount);
    //         } catch (error) {
    //             transaction.add(createAssociatedTokenAccountInstruction(publicKey, swapperHotwingsAccount, publicKey, hotwingsMint));
    //         }
    //         transaction.add(
    //             new TransactionInstruction({
    //                 keys: [
    //                     { pubkey: publicKey, isSigner: true, isWritable: true },
    //                     { pubkey: swapState, isSigner: false, isWritable: true },
    //                     { pubkey: hptVault, isSigner: false, isWritable: true },
    //                     { pubkey: hotwingsVault, isSigner: false, isWritable: true },
    //                     { pubkey: swapperHptAccount, isSigner: false, isWritable: true },
    //                     { pubkey: swapperHotwingsAccount, isSigner: false, isWritable: true },
    //                     { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    //                 ],
    //                 programId,
    //                 data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray('le', 8))),
    //             })
    //         );

    //         const signature = await sendTransaction(transaction, connection);
    //         await connection.confirmTransaction(signature, 'processed');

    //         setStatus('Swap successful!');
    //     } catch (error) {
    //         console.error('Swap failed:', error);
    //         setStatus(`Swap failed: ${error.message}`);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleMaxAmount = () => {
    //     if (hptBalance) {
    //         setAmount(hptBalance);
    //     }
    // };

    return (
      <>
        <div className="App flex border-solid border-2 border-red-100 rounded-[4px]">
            <WalletMultiButton />
            {/* {connected && (
                <div>
                    {hptBalance !== null ? <p>HPT Balance: {hptBalance}</p> : <p>Loading Balance...</p>}
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount of HPT to swap" />
                    <button onClick={handleMaxAmount}>MAX</button>
                    <button onClick={swapTokens} disabled={isLoading}>
                        {isLoading ? 'Swapping...' : 'Swap'}
                    </button>
                    <p>{status}</p>
                </div>
            )} */}
        </div>
      </>
    );
}

export default App
