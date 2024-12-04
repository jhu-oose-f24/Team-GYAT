import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Box } from '@mui/material';
import { useWallet } from "./WalletContext";
import { useAuth } from './AuthContext';
import { ethers, BrowserProvider } from "ethers";
import JobContractJSON from "../contract/artifact/JobContract.json";

const API_URL = process.env.REACT_APP_API_URL;

const Job = ({ jobId, onRequest, requested }) => {
  const [jobData, setJobData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const { walletAddress } = useWallet();
  const { userId } = useAuth(); // Get the current user's ID from AuthContext
  const navigate = useNavigate(); // Hook for navigation

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRequestService = async () => {
    try {
      const JobContractABI = JobContractJSON.abi;

      if (!walletAddress) {
        alert("Please connect ETH wallet to request job.");
        throw new Error("Wallet not connected.");
      }

      const requester = new BrowserProvider(window.ethereum);
      const signer = await requester.getSigner();

      const contract = new ethers.Contract(
        jobData.smart_contract_address,
        JobContractABI,
        signer
      );

      const provider_address = await contract.provider();
      const job_price = await contract.price();

      if (provider_address === walletAddress) {
        alert("Provider and Requester wallet addresses must be different!");
        throw new Error("Same Provider/Requester address");
      }

      const tx = await contract.acceptJob({
        value: job_price
      });

      await tx.wait();

      const formData = new FormData();
      formData.append("status", "accepted");
      const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
        method: "PUT",
        body: formData
      });

      if (response.ok) {
        console.log("Job accepted successfully");
        requestService();
      } else {
        console.error("Error accepting job", response);
      }
    } catch (error) {
      console.error("Error requesting service:", error);
    }
  };

  const handleCompleteJob = async () => {
    try {
      const JobContractABI = JobContractJSON.abi;

      if (!walletAddress) {
        alert("Please connect ETH wallet to complete job.");
        throw new Error("Wallet not found");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        jobData.smart_contract_address,
        JobContractABI,
        signer
      );

      const contract_provider_address = await contract.provider();

      if (walletAddress !== contract_provider_address) {
        alert("Provider must use the same wallet address as when contract was created!");
        throw new Error("Provider address mismatch");
      }

      const tx = await contract.markJobCompleted();
      await tx.wait();

      const formData = new FormData();
      formData.append("status", "provider_done");
      const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
        method: "PUT",
        body: formData
      });

      if (response.ok) {
        console.log("Job successfully marked completed");
        handleClose();
      } else {
        console.error("Error marking job complete", response);
      }
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };

  const handleCreateConversation = async () => {
    if (!userId) {
      alert("You must be signed in to create a conversation.");
      return;
    }

    if (!jobData.provider_id) {
      alert("The job provider's ID is missing.");
      return;
    }

    try {
      await axios.post(`${API_URL}/conversations`, {
        participant_ids: [userId, jobData.provider_id], // Using `userId` and the provider's ID
      });

      navigate("/messages"); // Redirect to the messages page after conversation creation
    } catch (error) {
      console.error("Error creating conversation:", error.response?.data || error.message);
      alert("Failed to create conversation. Please try again.");
    }
  };

  React.useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs/${jobId}`);
        setJobData(response.data);
      } catch (err) {
        console.error("Error fetching job data:", err.message);
      }
    };
    fetchJobData();
  }, [jobId]);

  const requestService = () => {
    handleClose();
    onRequest(jobData);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    <>
      <Card sx={{ position: 'relative', width: '100%', height: 325 }}>
        <CardActionArea sx={{ height: '100%' }} onClick={handleOpen}>
          <CardMedia
            component="img"
            height="140"
            image={`${API_URL}/${jobData.image_url}`}
            alt={jobData.title || 'Job image'}
          />
          <CardContent sx={{ height: '100%' }}>
            <Typography gutterBottom variant="h5" component="div">
              {jobData.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3
              }}
            >
              {jobData.description}
            </Typography>
            <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Posted by: {jobData.provider_fullname || 'Unknown'}
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {jobData.tag_name}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Price: ${(jobData.price * 2518).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="job-modal-title"
        aria-describedby="job-modal-description"
        onClick={handleClose}
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          <CardMedia
            component="img"
            height="300"
            image={`${API_URL}/${jobData.image_url}`}
            alt={jobData.title || 'Job image'}
            sx={{ borderRadius: 1, marginBottom: 2 }}
          />

          <Typography id="job-modal-title" variant="h4" component="h2" gutterBottom>
            {jobData.title}
          </Typography>

          <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: 1 }}>
            {jobData.tag_name}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Price: ${(jobData.price * 2518).toFixed(2)}
          </Typography>

          <Typography id="job-modal-description" sx={{ marginBottom: 4 }}>
            {jobData.description}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleRequestService}
            sx={{
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: '#006400',
              }
            }}
          >
            Request This Service
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleCreateConversation}
          >
            Message Job Provider
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Job;
