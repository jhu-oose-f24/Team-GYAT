import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import JobFeed from './components/JobFeed';

function App() {

  return (
      <div className="App">
        <JobFeed/>
      </div>
   );
}

export default App;
