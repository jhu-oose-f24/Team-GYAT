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
import JobActionBtn from "./JobActionBtn"

const API_URL = process.env.REACT_APP_API_URL;
const ETH_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'; 


const Job = ({ jobId, onRequest, requested, refresh }) => {
  const [jobData, setJobData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const { walletAddress } = useWallet();
  const [ethPrice, setEthPrice] = React.useState(0); 

  const { userId } = useAuth(); // Get the current user's ID from AuthContext
  const navigate = useNavigate(); // Hook for navigation

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchEthPrice = async () => {
    try {
      const response = await axios.get(ETH_PRICE_API);
      const ethPriceData = response.data.ethereum.usd;
      setEthPrice(ethPriceData);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      setEthPrice(2518);
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
      // Check if a conversation already exists
      const existingConversations = await axios.get(`${API_URL}/users/${userId}/conversations`);
      const existingConversation = existingConversations.data.find(conversation =>
        conversation.participants.some(participant => participant.user_id === jobData.provider_id)
      );
  
      if (existingConversation) {
        // Redirect to the messages page with the existing conversation ID
        navigate(`/messages?conversationId=${existingConversation.conversation_id}`);
      } else {
        // Create a new conversation
        const response = await axios.post(`${API_URL}/conversations`, {
          participant_ids: [userId, jobData.provider_id], // Using `userId` and the provider's ID
        });
  
        // Redirect to the messages page with the new conversation ID
        navigate(`/messages?conversationId=${response.data.conversation_id}`);
      }
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
    fetchEthPrice(); 
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
            image={jobData.image_url?.startsWith('http') ? jobData.image_url : `${API_URL}/${jobData.image_url}`}
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
                Price: ${(jobData.price * ethPrice).toFixed(2)}
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
            image={jobData.image_url?.startsWith('http') ? jobData.image_url : `${API_URL}/${jobData.image_url}`}
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
            Price:  ${(jobData.price * ethPrice).toFixed(2)} 
          </Typography>

          <Typography id="job-modal-description" sx={{ marginBottom: 4 }}>
            {jobData.description}
          </Typography>

        <JobActionBtn jobData={jobData} 
                      userId={userId} 
                      walletAddress={walletAddress}
                      handleClose={handleClose} 
                      requestService={requestService}
                      refresh={refresh} />
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
