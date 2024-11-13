import * as React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import axios from 'axios';
import NavBar from './NavBar';

export default function ActiveContracts() {
  const [contracts, setContracts] = React.useState([]);

  React.useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/contracts/active');
        setContracts(response.data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };
    fetchContracts();
  }, []);

  const handleCompleteJob = async (contractId) => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/contracts/${contractId}/complete`);
      if (response.status === 200) {
        setContracts(prevContracts =>
          prevContracts.map(contract =>
            contract.id === contractId ? { ...contract, status: 'Complete' } : contract
          )
        );
      }
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  return (
    <Box>
      {/* Navbar */}
      <NavBar />

      {/* Page Content */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Active Contracts
        </Typography>
        
        {/* Contract Cards */}
        <Grid container spacing={3}>
          {contracts.map(contract => (
            <Grid item xs={12} sm={6} md={4} key={contract.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">
                    {contract.serviceName}
                  </Typography>
                  <Typography color="text.secondary">
                    Requester: {contract.requester}
                  </Typography>
                  <Typography color="text.secondary">
                    Provider: {contract.provider}
                  </Typography>
                  <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
                    Status: {contract.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={contract.status === 'Complete'}
                    onClick={() => handleCompleteJob(contract.id)}
                  >
                    Complete Job
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
