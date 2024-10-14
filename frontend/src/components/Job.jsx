import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

const Job = (jobId) => {
    const jobData = await () => {
      try {
        const data = await axios.get(`http:/127.0.0.1:5000/jobs/${jobId}`);
      } catch (err) {
        console.log(err.message);
      }

    }

    return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/images/lizardd.webp" /* How do we get our own images */
          alt="green iguana" 
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {{data.title}}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    );
}

export default Job;
