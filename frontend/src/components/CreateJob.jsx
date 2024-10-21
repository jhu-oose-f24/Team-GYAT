import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import NavBar from './NavBar';
import JobContractJSON from '../contract/artifact/JobContract.json';
import { ethers, ContractFactory, BrowserProvider } from "ethers";

function CreateJob() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobPhoto, setJobPhoto] = useState(null); // File object
    const [jobPrice, setJobPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        formData.append('provider_id', 1); // Assuming provider ID is hardcoded for now

        // limit max price to 0.01 ETH for now
        const priceValue = parseFloat(jobPrice);
        if (isNaN(priceValue) || priceValue <= 0 || priceValue > 0.01) {
            alert("Price must be positive and less than or equal to 0.01 ETH");
            setIsSubmitting(false);
            return;
        }

        // If the user has selected a file, append it to the FormData object
        if (jobPhoto) {
            formData.append('image', jobPhoto);
        }

        try {
            // deploy contract to blockchain
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({method: 'eth_requestAccounts' });

                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const provider_address = await signer.getAddress();

                console.log(JobContractABI);
                console.log(JobContractBytecode);
                console.log("signer!!" + signer);

                const factory = new ContractFactory(JobContractABI, JobContractBytecode, signer);
                const jobPriceWei = ethers.parseEther(jobPrice);

                console.log("address " + provider_address);
                console.log("jobPrice " + jobPriceWei);
                const contract = await factory.deploy(
                    provider_address,
                    jobPriceWei
                );

                await contract.deployed();
                formData.append("smart_contract_address", contract.address);
            } else {
                console.error("ETH provider not available");
                alert("Install metamask or another eth wallet provider");
            }
                    
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
                style={{ display: 'none'}}
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

            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
        </Box>
        </>
    );
}

export default CreateJob;
