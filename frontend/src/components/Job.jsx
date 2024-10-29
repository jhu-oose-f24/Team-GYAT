import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';
import { Box } from '@mui/material';

const Job = ({ jobId }) => {

  const [jobData, setJobData] = React.useState({});

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

  return (
    <Card sx={{ position: 'relative', width: '100%', height: 325 }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="140"
          image={`http://127.0.0.1:5000/${jobData.image_url}`}
          alt="green iguana"
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
  );
}

export default Job;
