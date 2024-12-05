import React from 'react';
import Button from "@mui/material/Button";
import { ethers, BrowserProvider } from "ethers";
import JobContractJSON from "../contract/artifact/JobContract.json";

const API_URL = process.env.REACT_APP_API_URL;

const JobActionBtn = ({ jobData, userId, walletAddress, handleClose, requestService, refresh }) => {

    const handleRequestService = async () => {
        try {
            const JobContractABI = JobContractJSON.abi;

            if (!walletAddress) {
                alert("Please connect ETH wallet to request job.");
                throw new Error("Wallet not connected.");
            }

            const requester = new BrowserProvider(window.ethereum);
            const signer = await requester.getSigner();

            const contract = new ethers.Contract(
                jobData.smart_contract_address,
                JobContractABI,
                signer
            );

            const provider_address = await contract.provider();
            const job_price = await contract.price();

            if (provider_address.toLowerCase() === walletAddress.toLowerCase()) {
                alert("Provider and Requester wallet addresses must be different!");
                throw new Error("Same Provider/Requester address");
            }

            const tx = await contract.acceptJob({
                value: job_price
            });

            await tx.wait();

            const formData = new FormData();
            const jobId = jobData.job_id;
            formData.append("status", "accepted");
            formData.append("requester_id", userId);
            const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
                method: "PUT",
                body: formData
            });

            if (response.ok) {
                requestService();
            } else {
                console.error("Error accepting job", response);
            }
        } catch (error) {
            console.error("Error requesting service:", error);
        }
    };

    const handleCompleteJob = async () => {
        try {
            const JobContractABI = JobContractJSON.abi;

            if (!walletAddress) {
                alert("Please connect ETH wallet to complete job.");
                throw new Error("Wallet not found");
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                jobData.smart_contract_address,
                JobContractABI,
                signer
            );

            const contract_provider_address = await contract.provider();

            if (walletAddress.toLowerCase() !== contract_provider_address.toLowerCase()) {
                alert("Provider must use the same wallet address as when contract was created!");
                throw new Error("Provider address mismatch");
            }

            const tx = await contract.markJobCompleted();
            await tx.wait();

            const formData = new FormData();
            formData.append("status", "provider_done");
            const jobId = jobData.job_id;
            const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
                method: "PUT",
                body: formData
            });

            if (response.ok) {
                refresh(prev => prev + 1);
                handleClose();
            } else {
                console.error("Error marking job complete", response);
            }
        } catch (error) {
            console.error("Error completing job:", error);
        }
    };
    
    const handleApproveCompletion = async () => {
        try {
            const JobContractABI = JobContractJSON.abi;

            if (!walletAddress) {
                alert("Please connect ETH wallet to complete job.");
                throw new Error("Wallet not found");
            }

            const requester = new BrowserProvider(window.ethereum);
            const signer = await requester.getSigner();

            const contract = new ethers.Contract(
                jobData.smart_contract_address,
                JobContractABI,
                signer
            );

            const contract_requester_address = await contract.requester();

            if (walletAddress.toLowerCase() !== contract_requester_address.toLowerCase()) {
                alert("Requester must use the same wallet address as when job requested!");
                throw new Error("Requester address mismatch");
            }

            const tx = await contract.confirmJobCompletion();
            await tx.wait();

            const formData = new FormData();
            formData.append("status", "finished");
            const jobId = jobData.job_id;
            const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
                method: "PUT",
                body: formData
            });

            if (response.ok) {
                refresh(prev => prev+1);
                handleClose();
            } else {
                console.error("Error approving job completion", response);
            }
        } catch (error) {
            console.error("Error completing job:", error);
        }
    };


    let buttonLabel = null;
    let callback = null;

    if (jobData.provider_id === userId) {
        if (jobData.status === "accepted") {
            buttonLabel = "Mark Job Complete";
            callback = handleCompleteJob;
        }
    } else {
        if (jobData.status === "open") {
            buttonLabel = "Request This Service";
            callback = handleRequestService;
        } else if (jobData.status === "provider_done") {
            buttonLabel = "Approve Job";
            callback = handleApproveCompletion;
        }
    }

    if (!buttonLabel || !callback) return null;

    return (
          <Button
            variant="contained"
            fullWidth
            onClick={callback}
            sx={{
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: '#006400',
              }
            }}
          >
            {buttonLabel}
          </Button>
    );
}

export default JobActionBtn;
