import React from "react";

export default function WalletInfoCard({
    walletAddress,
    copied,
    setCopied,
    darkMode,
    balance,
    chainId,
    network
}) {
    return (
        <>
            <div className={`p-4 rounded-xl border
                ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Wallet Address
                    </span>
                    <div className="flex space-x-1 cursor-pointer">
                        <button
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(walletAddress);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                } catch (err) {
                                    console.error("Copy failed:", err);
                                }
                            }}
                            className={`cursor-pointer text-xs p-1 rounded flex items-center space-x-1 transition
                                ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            title={copied ? "Copied!" : "Copy to clipboard"}
                        >
                            {copied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="font-mono text-sm break-all text-pink-500">
                    {walletAddress}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-2 rounded-xl border
                    ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-sm font-medium mb-1 text-gray-500">Balance</div>
                    <div className="font-bold text-xl">
                        {balance} <span className="text-sm font-normal">ETH</span>
                    </div>
                </div>
                <div className={`p-2 rounded-xl border
                    ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-sm font-medium mb-1 text-gray-500">Chain ID</div>
                    <div className="font-bold text-lg truncate">{chainId}</div>
                </div>
            </div>
            <div className={`p-2 rounded-xl border
                ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-sm font-medium mb-1 text-gray-500">Network</div>
                <div className="font-bold text-lg truncate">{network}</div>
            </div>
        </>
    );
}