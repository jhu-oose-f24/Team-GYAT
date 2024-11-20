import { ethers } from 'ethers';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import GoogleAuthButtons from "./GoogleAuthButtons.jsx"
import { useAuth } from './AuthContext';

export default function NavBar() {
  const [walletAddress, setWalletAddress] = React.useState("");
  const navigate = useNavigate();
  const { isSignedIn, userName, userEmail, userId } = useAuth();
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
  };

  const profilePage = () => {
    navigate('/userProfile');
  };

  const createJob = () => {
    navigate('/createJob');
  };

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx = {{  bgcolor: '#68ACE5' }}>
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
          <Button color="inherit" onClick={createJob}> Become a Seller</Button>
          <Button color="inherit" onClick={profilePage}> Profile</Button>
          {walletAddress ? (
            <p>Signed in as {walletAddress.substr(0, 6)}...</p>
            ) : (
            <Button color="inherit" onClick={handleConnect}>Login</Button>
          )}
          <GoogleAuthButtons />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
