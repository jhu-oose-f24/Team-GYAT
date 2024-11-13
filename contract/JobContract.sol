//  SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract JobContract {
    enum JobStatus {Open, Accepted, ProviderDone, RequesterApproved, Finished }

    address payable public provider;
    address payable public requester;
    uint256 public price;
    JobStatus public status;

    // events to log actions
    event JobAccepted(address indexed requester);
    event JobCompleted(address indexed provider);
    event JobConfirmed(address indexed requester);
    event PaymentReleased(address indexed provider, uint256 amount);

    // create contract
    constructor(address payable provider_, uint256 price_) {
        provider = provider_;
        price = price_;
        status = JobStatus.Open;
    }

    // requester accepts job posting
    function acceptJob() external payable {
        require(status == JobStatus.Open, "Job is not open for acceptance.");
        require(msg.value == price, "Payment must match the price of the job.");

        requester = payable(msg.sender);
        status = JobStatus.Accepted;
        emit JobAccepted(requester);
    }

    // provider marks job as completed
     function markJobCompleted() external {
        require(msg.sender == provider, "Only the provider can mark job as completed");
        require(status == JobStatus.Accepted, "Job must be in accepted status");
        
        status = JobStatus.ProviderDone;
        emit JobCompleted(provider);
    }

    // requester confirms job completion
    function confirmJobCompletion() external {
        require(msg.sender == requester, "Only the requester can confirm job completion");
        require(status == JobStatus.ProviderDone, "Job must be marked as completed by provider");
        
        status = JobStatus.RequesterApproved;
        emit JobConfirmed(requester);
        
        releasePayment();
    }

    // internal function to release payment to the provider
    function releasePayment() internal {
        require(status == JobStatus.RequesterApproved, "Job must be approved by requester");
        
        status = JobStatus.Finished;
        provider.transfer(price);
        
        emit PaymentReleased(provider, price);
    }
}
