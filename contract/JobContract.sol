//  SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract JobContract {
    enum JobStatus {Open, Accepted, ProviderDone, Finished }

    uint128 public immutable price;
    JobStatus public status;
    address payable public immutable provider;
    address public requester;

    // events to log actions
    event JobAccepted(address requester);
    event JobCompleted(address provider);
    event ConfirmCompletion(address requester);

    // create contract
    constructor(address payable provider_, uint128 price_) {
        provider = provider_;
        price = price_;
    }

    // requester accepts job posting
    function acceptJob() external payable {
        require(msg.value == price, "Payment must match the price of the job.");
        require(status == JobStatus.Open, "Job is not open for acceptance.");

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
        
        status = JobStatus.Finished;
        emit ConfirmCompletion(requester);
        provider.transfer(price);
    }
}
