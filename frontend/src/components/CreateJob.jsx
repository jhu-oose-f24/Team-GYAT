import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import NavBar from './NavBar';
import { useEffect } from 'react';
function CreateJob() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobPhoto, setJobPhoto] = useState(null); // File object
    const [jobPrice, setJobPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobTag, setJobTag] = useState('');
    const [tags, setTags] = useState([]);


    useEffect(() => {
        // Fetch available tags when component mounts
        const fetchTags = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/tags');
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Create a FormData object to handle the form and file data
        const formData = new FormData();
        formData.append('title', jobTitle);
        formData.append('description', jobDescription);
        formData.append('price', jobPrice);
        formData.append('status', 'open');
        formData.append('provider_id', 1); // Assuming provider ID is hardcoded for now
        formData.append('tag_id', jobTag);

        console.log(jobTag);
        // If the user has selected a file, append it to the FormData object
        if (jobPhoto) {
            formData.append('image', jobPhoto);
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/jobs', {
                method: 'POST',
                body: formData, // Pass FormData directly
            });

            if (response.ok) {
                // Handle successful response
                console.log('Job created successfully');

                // Clear the form fields
                setJobTitle('');
                setJobDescription('');
                setJobPhoto(null);
                setJobPrice('');
                setJobTag('');
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
        setJobPhoto(file); // Store the file object
    };

    return (
        <>
            <NavBar />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '50%', margin: '0 auto' }}
            >
                <Typography variant="h4" align="center" sx={{ fontFamily: 'Roboto', mt: 5, mb: 4 }}>
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
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <label htmlFor="job-photo-upload">
                    <Button variant="contained" component="span" color="primary">
                        Upload Job Photo
                    </Button>
                </label>
                {jobPhoto && <Typography variant="body2" color="textSecondary">Selected file: {jobPhoto.name}</Typography>}

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

                <Box>
                    <label htmlFor="job-tag">Select Tag</label>
                    <select
                        id="job-tag"
                        value={jobTag}
                        onChange={(e) => setJobTag(e.target.value)}
                        required
                    >
                        <option value="">Select a tag</option>
                        {tags.map((tag) => (
                            <option key={tag.tag_id} value={tag.tag_id}>
                                {tag.tag_name}
                            </option>
                        ))}
                    </select>
                </Box>

                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </Box>
        </>
    );
}

export default CreateJob;