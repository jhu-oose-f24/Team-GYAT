import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import JobFeed from './components/JobFeed';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
      const initWallet = async () => {
        try {
          // Get metamask info 
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          setProvider(provider);
          
          // Gets the account signer for transactions
          const signer = await provider.getSigner();
          setSigner(signer);
          
          // Gets the public address of connected wallet
          const address = await signer.getAddress();
          setAccount(address);
        } catch (error) {
          console.error('User denied account access', error);
        }
      };
    initWallet();
  }, []);

  return (
      <div className="App">
        <h1>Ethereum Wallet Login</h1>
        {account ? (
            <div>
              <p>Connected Account: {account}</p>
            </div>
            ) :
            ( <p>Please connect your Ethereum wallet</p>)
        }
        <JobFeed/>
      </div>
   );
}

export default App;
