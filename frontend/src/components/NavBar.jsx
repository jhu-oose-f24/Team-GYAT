import { ethers } from 'ethers';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleAuthButtons from "./GoogleAuthButtons.jsx";
import { useAuth } from './AuthContext';
import { useWallet } from "./WalletContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { isSignedIn, userName, userEmail, userId } = useAuth();
  const { walletAddress, setWalletAddress } = useWallet();

  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting to MetaMask', error);
      }
    } else {
      alert('MetaMask not detected');
    }
  }

  async function handleConnect() {
    if (window.ethereum) {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log(walletAddress);
    }
  }

  function disconnectWallet() {
      setWalletAddress("");
  }

  const CompletedJobsPage = () => {
      navigate('/CompletedJobs');
  }

  const PendingJobs = () => {
      navigate('/PendingJobs');
  }

  const profilePage = () => {
    navigate('/userProfile');
  };

  const createJob = () => {
    navigate('/createJob');
  };

  const directMessages = () => {
    navigate('/messages');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#68ACE5' }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              '& a': {
                color: 'inherit',
                textDecoration: 'none',
              },
              '& a:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Link to="/">JHU Marketplace</Link>
          </Typography>
          <Button color="inherit" onClick={createJob} disabled={!isSignedIn}>
            Become a Seller
          </Button>
          <Button color="inherit" onClick={profilePage} disabled={!isSignedIn}>
            Profile
          </Button>
          <Button color="inherit" onClick={directMessages} disabled={!isSignedIn}>
            Direct Messages
          </Button>
          <Button color="inherit" onClick={CompletedJobsPage} disabled={!isSignedIn}>
            Completed Jobs
          </Button>
          <Button color="inherit" onClick={PendingJobs} disabled={!isSignedIn}>
            Pending Jobs
          </Button>
          {walletAddress ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Typography sx={{ marginLeft: '1rem' }}>
              Wallet Connected: {walletAddress.substr(0, 6)}...
            </Typography>
            <Button color='inherit' onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}
          <GoogleAuthButtons />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
