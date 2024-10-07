import React, { useState } from 'react';
import { TextField, Button, Input, Box, Typography } from '@mui/material';
import NavBar from './NavBar';

function CreateJob() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobPhoto, setJobPhoto] = useState(null);
    const [jobPrice, setJobPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', jobTitle);
        formData.append('description', jobDescription);
        formData.append('photo', jobPhoto);
        formData.append('price', jobPrice);

        try {
            const response = await fetch('YOUR_BACKEND_ENDPOINT_URL', {
                method: 'POST',
                body: formData,
                headers: {
                    
                },
            });

            if (response.ok) {
                // Handle successful response
                console.log('Job created successfully');
            } else {
                // Handle errors
                console.error('Error creating job');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setJobPhoto(file);
        setFileName(file ? file.name : '');
    };

    return (
        <> <NavBar />
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '50%', margin: '0 auto' }}
        >
            <Typography variant="h4" align="center" sx ={{ fontFamily: 'Roboto', mt: 5, mb: 4 }}>
                Post Your Service!
            </Typography>

            <TextField
                label="Service Title"
                variant="outlined"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
            />

            <TextField
                label="Service Description"
                variant="outlined"
                multiline
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
            />

            <input
                accept="image/*"
                id="job-photo-upload"
                type="file"
                style={{ display: 'none'}}
                onChange={handleFileChange}
            />
            <label htmlFor="job-photo-upload">
                <Button variant="contained" component="span" color="primary">
                    Upload Job Photo
                </Button>
            </label>
            {fileName && <Typography variant="body2" color="textSecondary">Selected file: {fileName}</Typography>}

            <TextField
                label="Price"
                variant="outlined"
                value={jobPrice}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                        setJobPrice(value);
                    }
                }}
                required
            />

            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </Box>
        </>
    );
}

export default CreateJob;