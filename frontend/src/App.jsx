import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobFeed from './components/JobFeed';
import CreateJob from './components/CreateJob';
import UserProfile from './components/userProfile';
import { AuthProvider } from "./components/AuthContext";
import Messages from './components/Messages';
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import { WalletProvider } from "./components/WalletContext";
import CompletedJobs from "./components/CompletedJobs";
import PendingJobs from "./components/PendingJobs";

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path = "/" element = {<LandingPage />} />
            <Route path = "/jobFeed" element = {<JobFeed/>}/>
            <Route path = "/createJob" element = {<CreateJob/>}/>
            <Route path = "/userProfile" element = {<UserProfile/>}/>
            <Route path="/messages" element={<Messages />} />
            <Route path="/CompletedJobs" element={<CompletedJobs />} />
            <Route path="/PendingJobs" element={<PendingJobs />} />
        </Routes>
      </BrowserRouter>
      </WalletProvider>
    </AuthProvider>
   );
}

export default App;
