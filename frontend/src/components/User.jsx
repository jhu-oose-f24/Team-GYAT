import React from 'react';
import { useState } from 'react';

class User {
  constructor(userId, userName, email, password) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.jobsProvided = [];
    this.jobsRequested = [];
  }

  getUserId() {
    return this.userId;
  }

  getProvidedJobs() {
    return this.jobsProvided;
  }

  getRequestedJobs() {
    return this.jobsRequested;
  }

  setProvidedJobs(jobs) {
    this.jobsProvided = jobs;
  }

  setRequestedJobs(jobs) {
    this.jobsRequested = jobs;
  }
}

const UserComponent = () => {
  const [user, setUser] = useState(null);

  const createUser = (userId, userName, email, password) => {
    const newUser = new User(userId, userName, email, password);
    setUser(newUser);
  };

  const updateProvidedJobs = (jobs) => {
    if (user) {
      user.setProvidedJobs(jobs);
      setUser({ ...user });
    }
  };

  const updateRequestedJobs = (jobs) => {
    if (user) {
      user.setRequestedJobs(jobs);
      setUser({ ...user });
    }
  };

  return (
    <div>
      {/*component JSX */}
    </div>
  );
};

export default UserComponent;