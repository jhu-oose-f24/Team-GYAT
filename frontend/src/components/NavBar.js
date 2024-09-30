import { ethers } from 'ethers';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export default function NavBar() {
  const [walletAddress, setWalletAddress] = React.useState("");
  
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

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" sx = {{  bgcolor: '#68ACE5' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JHU Marketplace
          </Typography>
          {walletAddress ? (
            <p>Signed in as {walletAddress.substr(0, 6)}...</p>
            ) : (
            <Button color="inherit" onClick={handleConnect}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
