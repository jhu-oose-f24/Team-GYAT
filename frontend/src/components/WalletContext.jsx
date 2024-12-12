import React, { createContext, useState, useContext } from "react";

/**
 * WalletContext: Context for managing and sharing wallet-related data throughout the app.
 * - Provides `walletAddress` state and `setWalletAddress` function to manage Ethereum wallet address.
 */
const WalletContext = createContext();

/**
 * WalletProvider: A context provider component that wraps the application or part of it
 * where wallet-related state needs to be shared.
 *
 * Props:
 * - children: React children components that will have access to the wallet context.
 */
export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");

    return (
        <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
        {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    return useContext(WalletContext);
};
