import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Box } from '@mui/material';

import { ethers, BrowserProvider } from "ethers";
import JobContractJSON from "../contract/artifact/JobContract.json";

const Job = ({ jobId, onRequest, requested }) => {
  const [jobData, setJobData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRequestService = async () => {
    try {
      const JobContractABI = JobContractJSON.abi;

      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const requester = new BrowserProvider(window.ethereum);
        const signer = await requester.getSigner();
        const requester_address = await signer.getAddress();

        const contract = new ethers.Contract(
          jobData.smart_contract_address,
          JobContractABI,
          signer);

        const provider_address = await contract.provider();
        const job_price = await contract.price();

        if (provider_address === requester_address) {
          console.error(
            "provider and requester cannot have the same wallet address");
          alert("Provider and Requester wallet addresses must be different!");
          throw new Error("Same Provider/Requester address");
        }

        const tx = await contract.acceptJob({
          value: job_price
        });

        const receipt = await tx.wait();
        console.log("Job accepted successfully: ", + receipt);

        const formData = new FormData();
        formData.append("status", "accepted");
        const response = await fetch(`https://task-market-7ba3283496a7.herokuapp.com/jobs/${jobId}/status`,
          { method: "PUT", body: formData }
        );

        if (response.ok) {
          console.log("job accepted successfully");
          requestService();

        } else {
          console.error("error accepting job");
          console.error(response);
        }

      } else {
        console.error("ETH provider not available");
        alert("Install Metamask or another eth wallet provider");
        throw new Error("Metamask not found");
      }
    } catch (error) {
      console.error(error);
    }

  };

  const handleCompleteJob = async () => {
    try {
      const JobContractABI = JobContractJSON.abi;

      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const provider_address = await signer.getAddress();

        const contract = new ethers.Contract(
          jobData.smart_contract_address,
          JobContractABI,
          signer);

        const contract_provider_address = await contract.provider();
        const job_price = await contract.price();

        if (provider_address !== contract_provider_address) {
          console.error("provider wallet address doesn't match with contract");
          alert("Provider must use same wallet address as when contract was created!");
          throw new Error("Provider address mismatch");
        }

        const tx = await contract.markJobCompleted();
        const receipt = await tx.wait();

        console.log("Job successfully marked completed: ", + receipt);

        const formData = new FormData();
        formData.append("status", "provider_done");
        const response = await fetch(`http://127.0.0.1:5000/jobs/${jobId}/status`,
          { method: "PUT", body: formData }
        );

        if (response.ok) {
          console.log("job successfully marked completed");
          handleClose();
        } else {
          console.error("error marking job complete");
          console.error(response);
        }

      } else {
        console.error("ETH provider not available");
        alert("Install Metamask or another eth wallet provider");
        throw new Error("Metamask not found");
      }
    } catch (error) {
      console.error(error);
    }
    console.log("Job completed:", jobData.title);
  };


  React.useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`https://task-market-7ba3283496a7.herokuapp.com/jobs/${jobId}`);
        setJobData(response.data);
      } catch (err) {
        console.log('here');
        console.log(err.message);
      }
    }
    fetchJobData();
  }, [jobId]);

  const requestService = () => {
    handleClose();
    onRequest(jobData);
  }

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
            image={`https://task-market-7ba3283496a7.herokuapp.com/${jobData.image_url}`}
            alt={jobData.title || 'Job image'}
          />
          <CardContent sx={{ height: '100%' }}>
            <Typography gutterBottom variant="h5" component="div">
              {jobData.title}
            </Typography>
            <Typography variant="body2" sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}>
              {jobData.description}
            </Typography>
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
            }}>
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
            image={`https://task-market-7ba3283496a7.herokuapp.com/${jobData.image_url}`}
            alt={jobData.title || 'Job image'}
            sx={{ borderRadius: 1, marginBottom: 2 }}
          />

          <Typography id="job-modal-title" variant="h4" component="h2" gutterBottom>
            {jobData.title}
          </Typography>

          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Posted by: <strong>{jobData.provider_name || 'Unknown'}</strong>
          </Typography>
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}></Box>

          <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: 1 }}>
            {jobData.tag_name}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Price: ${(jobData.price * 2518).toFixed(2)}
          </Typography>

          <Typography id="job-modal-description" sx={{ marginBottom: 4 }}>
            {jobData.description}
          </Typography>

          {requested ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleCompleteJob}
              sx={{
                backgroundColor: 'blue',
                '&:hover': {
                  backgroundColor: '#00008B',
                }
              }}
            >
              Mark Job Completed
            </Button>
          ) : (
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
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Job;
