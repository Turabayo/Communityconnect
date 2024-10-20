import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomeScreen.css'; // Add styles to enhance layout

const HomeScreen = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:8081/api/user', { withCredentials: true });
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome, {userInfo.firstName} {userInfo.lastName}</h1>
        <div className="profile-info">
          <img 
            src={userInfo.profilePicture ? `http://localhost:8081${userInfo.profilePicture}` : '/default-avatar.png'}
            alt="Profile Avatar"
            className="avatar-img"
          />
          <div className="user-details">
            <h2>{userInfo.firstName} {userInfo.lastName}</h2>
            <p>Services: {userInfo.servicesOffered || 'Not provided'}</p>
          </div>
        </div>
        <Link to="/profile">
          <button className="manage-profile-btn">Manage Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;
