import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Transactions from './Transactions';
import WalletInfoCard from './WalletInfoCard';
import ConnectWalletButton from './ConnectWalletButton';

export default function WalletConnection() {
    const [darkMode, setDarkMode] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [balance, setBalance] = useState('0');
    const [network, setNetwork] = useState('');
    const [chainId, setChainId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [showTransactions, setShowTransactions] = useState(false);
    const [isLoadingTxns, setIsLoadingTxns] = useState(false);
    const API_KEY = 'CVPBG3S7QCZYMW8E9UX6W5W6JJIWB27SAF';

    useEffect(() => {
        // Check if user was previously connected
        checkIfWalletIsConnected();

        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    handleAccountsChanged(accounts);
                } else {
                    setIsConnected(false);
                    setWalletAddress('');
                    setBalance('0');
                    setTransactions([]);
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) {
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
                handleAccountsChanged(accounts);
            }
        } catch (error) {
            console.error("Error checking if wallet is connected:", error);
        }
    };

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
            const web3 = new Web3(window.ethereum);
            setWalletAddress(accounts[0]);
            setIsConnected(true);

            // Get balance
            try {
                const balanceWei = await web3.eth.getBalance(accounts[0]);
                const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
                setBalance(parseFloat(balanceEth).toFixed(4));

                // Getting n/w info
                const chainId = Number(await web3.eth.getChainId());
                setChainId(chainId);

                let networkName = undefined;
                switch (chainId) {
                    case 1:
                        networkName = 'Ethereum Mainnet';
                        break;
                    case 5:
                        networkName = 'Goerli Testnet';
                        break;
                    case 137:
                        networkName = 'Polygon Mainnet';
                        break;
                    case 11155111:
                        networkName = 'Sepolia Testnet';
                        break;
                    default:
                        networkName = 'Unknown';
                }
                setNetwork(networkName);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed! Please install MetaMask to continue.");
            return;
        }

        setIsLoading(true);

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            handleAccountsChanged(accounts);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Error connecting wallet. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress('');
        setBalance('0');
        setNetwork('');
        setChainId('');
        setTransactions([]);
        setShowTransactions(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const getNetworkApiUrl = () => {
        switch (Number(chainId)) {
            case 1:
                return 'https://api.etherscan.io/api';
            case 5:
                return 'https://api-goerli.etherscan.io/api';
            case 11155111:
                return 'https://api-sepolia.etherscan.io/api';
            default:
                return null;
        }
    };

    const fetchTransactions = async () => {
        if (!walletAddress) return;

        const apiUrl = getNetworkApiUrl();
        if (!apiUrl) {
            alert('Transaction history is only available for Ethereum Mainnet, Goerli, and Sepolia networks');
            return;
        }

        setIsLoadingTxns(true);
        try {
            const url = `${apiUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "1" && Array.isArray(data.result)) {
                // Get all transactions instead of limiting to 10
                setTransactions(data.result);
            } else {
                console.error("Error fetching transactions:", data);
                setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
        } finally {
            setIsLoadingTxns(false);
        }
    };

    const toggleTransactions = async () => {
        // If we're about to show transactions and we don't have any yet, fetch them
        if (!showTransactions && transactions.length === 0) {
            await fetchTransactions();
        }
        setShowTransactions(!showTransactions);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header with dark mode toggle */}
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                        Web3 Wallet Connect
                    </h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full border-2 transition-all hover:scale-110 cursor-pointer"
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Main Card */}
                <div className={`max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl 
          ${darkMode ? 'bg-gray-800 shadow-blue-500/20' : 'bg-white shadow-gray-200/50'}
          transform transition-all duration-300 hover:scale-105`}
                    style={{
                        backdropFilter: 'blur(10px)',
                        background: darkMode ?
                            'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' :
                            'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(240,240,240,0.9))'
                    }}
                >
                    <div className="p-4">
                        <div className="text-center mb-8">
                            <div className="inline-block rounded-full p-4 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">MetaMask Wallet</h2>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {isConnected ? 'Your wallet is connected' : 'Connect your wallet to continue'}
                            </p>
                        </div>

                        {!isConnected ? (
                            <ConnectWalletButton
                                connectWallet={connectWallet}
                                isLoading={isLoading}
                                darkMode={darkMode}
                            />
                        ) : (
                            <div className="space-y-6">
                                {/* Wallet Info Cards */}
                                <WalletInfoCard
                                    walletAddress={walletAddress}
                                    copied={copied}
                                    setCopied={setCopied}
                                    darkMode={darkMode}
                                    balance={balance}
                                    chainId={chainId}
                                    network={network}
                                />
                                {/* Transaction History Button */}
                                <button
                                    onClick={toggleTransactions}
                                    className={`w-full py-3 rounded-lg font-medium mt-2 flex items-center justify-center transition-all duration-200
                  ${darkMode ?
                                            'bg-gray-700 hover:bg-gray-600 text-gray-300' :
                                            'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {showTransactions ? "Hide Transaction History" : "Show Transaction History"}
                                </button>

                                {/* Transaction History Section */}
                                {showTransactions && (
                                    <Transactions
                                        transactions={transactions}
                                        isLoadingTxns={isLoadingTxns}
                                        darkMode={darkMode}
                                        network={network}
                                        walletAddress={walletAddress}
                                    />
                                )}

                                {/* Disconnect Button */}
                                <button
                                    onClick={disconnectWallet}
                                    className={`cursor-pointer w-full py-3 rounded-lg font-medium mt-4
                    transition-all duration-200
                    ${darkMode ?
                                            'bg-indigo-700 hover:bg-indigo-600 text-white' :
                                            'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                                >
                                    Disconnect Wallet
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`p-4 text-center text-sm
            ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                        <p>Developed by Pavan Kumar B</p>
                    </div>
                </div>
            </div>
        </div>
    );
}