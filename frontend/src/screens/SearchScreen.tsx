import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchScreen.css';  // Assume there’s some CSS to style the search results

const SearchScreen = () => {
  const [users, setUsers] = useState<any[]>([]);  // Array to hold user search results
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Function to fetch users based on search query
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8081/api/users?search=${searchQuery}`, { withCredentials: true });
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (searchQuery) {
      fetchUsers();  // Fetch users only if there's a search query
    }
  }, [searchQuery]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      
      <div className="search-results">
        {users.length === 0 && searchQuery && <p>No users found</p>}

        {users.map((user, index) => (
          <div key={index} className="user-card">
            <img
              src={user?.profilePicture ? `http://localhost:8081${user.profilePicture}` : '/default-avatar.png'}
              alt="Profile Avatar"
              className="profile-avatar"
            />
            
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>Services Offered: {user?.servicesOffered || 'N/A'}</p>
            <p>Location: {user?.location || 'N/A'}</p>
            <p>Availability: {user?.availability || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchScreen;
