import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobFeed from './components/JobFeed';
import CreateJob from './components/CreateJob';
import UserProfile from './components/userProfile';
import Messages from './components/Messages';
function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/" element = {<JobFeed/>}/>
          <Route path = "/createJob" element = {<CreateJob/>}/>
          <Route path = "/userProfile" element = {<UserProfile/>}/>
          <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
   );
}

export default App;
