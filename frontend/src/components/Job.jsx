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

const Job = ({ jobId }) => {
  const [jobData, setJobData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/jobs/${jobId}`);
        setJobData(response.data);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchJobData();
  }, [jobId]);

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
            image={`http://127.0.0.1:5000/${jobData.image_url}`}
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
            image={`http://127.0.0.1:5000/${jobData.image_url}`}
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
            sx={{ 
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: '#006400',
              }
            }}
          >
            Request This Service
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Job;