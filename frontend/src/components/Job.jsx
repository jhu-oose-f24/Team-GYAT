import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

const Job = ({jobId}) => {
    const [jobData, setJobData] = React.useState({});
    React.useEffect(() => {
    const fetchJobData = async () => {
        try {
          console.log(jobId);
          const response = await axios.get(`http://127.0.0.1:5000/jobs/${jobId}`);
          setJobData(response.data);
        } catch (err) {
          console.log(err.message);
        }
      }
      fetchJobData();
    }, [jobId]);
    console.log(jobData);
    return (
    <Card sx={{ width: '100%', height: 300 }}>
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {jobData.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    );
}

export default Job;