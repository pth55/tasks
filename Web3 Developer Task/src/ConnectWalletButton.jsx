import React from "react";

export default function ConnectWalletButton({ connectWallet, isLoading, darkMode }) {
    return (
        <button
            onClick={connectWallet}
            disabled={isLoading}
            className={`cursor-pointer w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2
                transition-all duration-300 transform hover:translate-y-1
                bg-gradient-to-r from-blue-500 to-purple-600 text-white
                hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting...</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>Connect with MetaMask</span>
                </>
            )}
        </button>
    );
}