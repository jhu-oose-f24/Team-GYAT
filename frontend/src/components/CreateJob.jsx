import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import NavBar from './NavBar';

import { useEffect } from 'react';

import JobContractJSON from '../contract/artifact/JobContract.json';
import { ethers, ContractFactory, BrowserProvider } from "ethers";
import { useAuth } from "./AuthContext";
import { useWallet } from "./WalletContext";

const API_URL = process.env.REACT_APP_API_URL;

function CreateJob() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobPhoto, setJobPhoto] = useState(null); // File object
    const [jobPrice, setJobPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobTag, setJobTag] = useState('');
    const [tags, setTags] = useState([]);
    const { walletAddress } = useWallet();
    
    const { userId } = useAuth();

    useEffect(() => {
        // Fetch available tags when component mounts
        const fetchTags = async () => {
            try {
                console.log(API_URL);
                const response = await fetch(`${API_URL}/tags`);
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const JobContractABI = JobContractJSON.abi;
    const JobContractBytecode = JobContractJSON.data.bytecode?.object;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Create a FormData object to handle the form and file data
        const formData = new FormData();
        formData.append('title', jobTitle);
        formData.append('description', jobDescription);
        formData.append('price', jobPrice);
        formData.append('status', 'open');
        formData.append('provider_id', 3); 
        formData.append('tag_name', jobTag);


        console.log(userId);
        console.log(jobTag);

        // limit max price to 0.01 ETH for now
        const priceValue = parseFloat(jobPrice);
        if (isNaN(priceValue) || priceValue <= 0 || priceValue > 100) {
            alert("Price must be positive and less than or equal to 100 ETH");
            setIsSubmitting(false);
            return;
        }

        console.log(priceValue);

        // If the user has selected a file, append it to the FormData object
        if (jobPhoto) {
            formData.append('image', jobPhoto);
        }

        try {
            // deploy contract to blockchain
            if (!walletAddress) {
                alert("Please connect ETH wallet to create job.");
                throw new Error("Wallet not connected.");
            }

            console.log("using wallet address: ", walletAddress);
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const factory = new ContractFactory(JobContractABI, JobContractBytecode, signer);

            const jobPriceWei = ethers.parseEther(jobPrice);

            const contract = await factory.deploy(
                walletAddress,
                jobPriceWei
            );
            await contract.waitForDeployment();

            formData.append("smart_contract_address", contract.target);

            const response = await fetch(`${API_URL}/jobs`, {
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
                console.error(response.data);
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

                <TextField
                    select
                    label="Select Tag"
                    value={jobTag}
                    onChange={(e) => setJobTag(e.target.value)}
                    fullWidth
                    required
                >
                    <MenuItem value="">
                        Select a tag
                    </MenuItem>
                    {tags.map((tag) => (
                        <MenuItem key={tag.tag_id} value={tag.tag_name}>
                            {tag.tag_name}
                        </MenuItem>
                    ))}
                </TextField>


                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </Box>
        </>
    );
}

export default CreateJob;
