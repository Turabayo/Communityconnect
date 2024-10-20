import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [availability, setAvailability] = useState('');
  const [pricing, setPricing] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null); // Avatar state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:8081/api/user', {
          withCredentials: true,
        });

        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setServicesOffered(data.servicesOffered || '');
        setAvailability(data.availability || '');
        setPricing(data.pricing || 0);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    const formData = new FormData(); // Create FormData to handle file uploads
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('servicesOffered', servicesOffered);
    formData.append('availability', availability);
    formData.append('pricing', pricing.toString());
    if (avatar) formData.append('avatar', avatar); // Append avatar if selected

    try {
      await axios.put(`http://localhost:8081/api/profile/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure to use the correct header for file upload
        },
        withCredentials: true,
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        history.push('/');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Error updating profile');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('File selected:', e.target.files[0]); // Log the selected file
      setAvatar(e.target.files[0]); // Set avatar to the selected file
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="manage-profile-container">
      <h1>Manage Your Profile</h1>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Services Offered:</label>
          <input
            type="text"
            value={servicesOffered}
            onChange={(e) => setServicesOffered(e.target.value)}
          />
        </div>
        <div>
          <label>Availability:</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>
        <div>
          <label>Pricing:</label>
          <input
            type="number"
            value={pricing}
            onChange={(e) => setPricing(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Avatar:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange} // Handle file selection
          />
        </div>

        {user?.profilePicture && (
          <img
            src={`http://localhost:8081${user.profilePicture}`} // Ensure correct URL
            alt="Profile Avatar"
            className="profile-avatar"
          />
        )}

        <button className="update-button" type="button" onClick={updateProfile}>
          Update Profile
        </button>
      </form>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <footer>Copyright © Community Connect</footer>
    </div>
  );
};

export default Profile;