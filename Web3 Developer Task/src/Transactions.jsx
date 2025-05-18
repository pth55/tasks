import React from "react";
import Web3 from "web3";

const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
};

const getTransactionType = (tx, walletAddress) => {
    if (tx.from.toLowerCase() === walletAddress.toLowerCase() && (!tx.to || tx.to === "")) {
        return "Contract Creation";
    }
    if (tx.from.toLowerCase() === walletAddress.toLowerCase()) {
        return "Sent";
    }
    if (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase()) {
        return "Received";
    }
    return "Interaction";
};

const formatValue = (value) => {
    const web3 = new Web3();
    const ethValue = web3.utils.fromWei(value, 'ether');
    return parseFloat(ethValue).toFixed(4);
};

export default function Transactions({
    transactions,
    isLoadingTxns,
    darkMode,
    network,
    walletAddress
}) {
    return (
        <div className={`rounded-xl border transition-all duration-300 overflow-hidden
            ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="p-4 border-b border-gray-600">
                <h3 className="font-bold text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Recent Transactions
                </h3>
            </div>
            <div className="overflow-x-auto">
                {isLoadingTxns ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} sticky top-0 z-10`}>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Hash</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Value (ETH)</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                                {transactions.map((tx, index) => (
                                    <tr key={index} className={`hover:${darkMode ? 'bg-gray-600/40' : 'bg-gray-100'}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${getTransactionType(tx, walletAddress) === 'Sent' ? 'bg-red-100 text-red-800' :
                                                    getTransactionType(tx, walletAddress) === 'Received' ? 'bg-green-100 text-green-800' :
                                                        getTransactionType(tx, walletAddress) === 'Contract Creation' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-blue-100 text-blue-800'}`}>
                                                {getTransactionType(tx, walletAddress)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                                            <a
                                                href={`https://${network === 'Sepolia Testnet' ? 'sepolia.' : network === 'Goerli Testnet' ? 'goerli.' : ''}etherscan.io/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                {truncateAddress(tx.hash)}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {formatValue(tx.value)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            {formatDate(tx.timeStamp)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${tx.isError === '0' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {tx.isError === '0' ? 'Success' : 'Failed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No transactions found for this wallet on {network}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}