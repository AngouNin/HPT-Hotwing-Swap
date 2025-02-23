import { FC, useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction} from '@solana/spl-token';

import {
  ADMIN_WALLET_ADDRESS,
  HPT_MINT_ADDRESS,
} from '../config';

const SwapInterface: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [hptBalance, setHptBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [adminHptAmount, setAdminHptAmount] = useState('');
  const [adminHotwingsAmount, setAdminHotwingsAmount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;


    try {
      const tokenAccount = await getAssociatedTokenAddress(
        HPT_MINT_ADDRESS,
        publicKey
      );
      console.log("Associated Token Address:", tokenAccount.toBase58());
      // const tokenAccount2 = await getAccount(connection, tokenAccount);
      // console.log("tokenaccount=========>", tokenAccount2.toString())
      console.log("HPT_MINT_ADDRESS=========>", HPT_MINT_ADDRESS.toString())
      console.log("publicKey=========>", publicKey.toString())

      try {
        console.log("balance==================>")

        // Try to get the account info first
        await getAccount(connection, tokenAccount);
        // If successful, get the balance
        const balance = await connection.getTokenAccountBalance(tokenAccount);
        console.log("balance===>", balance)
        setHptBalance(Number(balance.value.amount));
      } catch (err) {
        // Type guard to check if error is TokenAccountNotFoundError
        if (err instanceof Error && err.name === 'TokenAccountNotFoundError') {
          setStatus('Creating token account...');
          const transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              publicKey, // payer
              tokenAccount, // ata
              publicKey, // owner
              HPT_MINT_ADDRESS // mint
            )
          );
          
          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(signature);
          setStatus('Token account created!');
          setHptBalance(0);
        } else {
          console.error('Error fetching balance:', err);
          setHptBalance(0);
        }
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setHptBalance(0);
    }
  }, [publicKey, connection, sendTransaction]);

  useEffect(() => {
    if (publicKey) {
      setIsAdmin(publicKey.equals(ADMIN_WALLET_ADDRESS));
      fetchBalance();
    } else {
      setHptBalance(0);
    }
  }, [publicKey, fetchBalance]);

  const handleMaxAmount = () => {
    setAmount(hptBalance.toString());
  };

  const swapTokens = async () => {
    if (!publicKey || !amount) return;

    setIsLoading(true);
    setStatus('Initiating swap...');

    try {
      const transaction = new Transaction();
      // Add your swap instruction here
      // This is a placeholder - you'll need to implement the actual swap logic
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      setStatus('Swap successful!');
      await fetchBalance();
    } catch (err) {
      console.error('Swap failed:', err);
      setStatus('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawTokens = async (isHpt: boolean, amount: string) => {
    if (!publicKey || !amount) return;

    setIsLoading(true);
    setStatus(`Initiating ${isHpt ? 'HPT' : 'HotWings'} withdrawal...`);

    try {
      const transaction = new Transaction();
      // Add your withdrawal instruction here
      // This is a placeholder - you'll need to implement the actual withdrawal logic
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      setStatus('Withdrawal successful!');
      await fetchBalance();
    } catch (err) {
      console.error('Withdrawal failed:', err);
      setStatus('Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
      <div className="flex justify-center mb-6">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
      </div>

      {publicKey && (
        <>
          <div className="mb-6">
            <p className="text-sm mb-2">Your HPT Balance:</p>
            <p className="text-2xl font-bold">{hptBalance} HPT</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Amount to Swap</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter amount"
                />
                <button
                  onClick={handleMaxAmount}
                  className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            <button
              onClick={swapTokens}
              disabled={isLoading || !amount}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                'Swap Tokens'
              )}
            </button>

            {isAdmin && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold mb-4">Admin Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">HPT Withdrawal Amount</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={adminHptAmount}
                        onChange={(e) => setAdminHptAmount(e.target.value)}
                        className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter amount"
                      />
                      <button
                        onClick={() => withdrawTokens(true, adminHptAmount)}
                        disabled={isLoading || !adminHptAmount}
                        className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Withdraw HPT
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">HotWings Withdrawal Amount</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={adminHotwingsAmount}
                        onChange={(e) => setAdminHotwingsAmount(e.target.value)}
                        className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter amount"
                      />
                      <button
                        onClick={() => withdrawTokens(false, adminHotwingsAmount)}
                        disabled={isLoading || !adminHotwingsAmount}
                        className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Withdraw HotWings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                status.includes('failed') 
                  ? 'bg-red-500/20 text-red-100' 
                  : status.includes('success') 
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-blue-500/20 text-blue-100'
              }`}>
                {status.includes('failed') ? (
                  <AlertCircle className="w-5 h-5" />
                ) : status.includes('success') ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                <span>{status}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SwapInterface;