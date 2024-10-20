import { SyntheticEvent, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import './SignScreen.css'; // Link to custom styling

interface Props {
  history: RouteComponentProps['history'];
}

const SignupScreen = ({ history }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role as "user"
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8081/api/register', {
        firstName,
        lastName,
        email,
        password,
        role,  // Include the role in the request
      });

      setSuccessMessage('Sign up successful! Redirecting to login...');
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="signup-container">
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler} className="py-3">
        <Form.Group controlId="firstName" className="my-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="lastName" className="my-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="role" className="my-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="provider">Service Provider</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="my-3 signup-button">
          Sign Up
        </Button>
      </Form>

      {errorMessage && (
        <Alert variant="danger" className="text-center mt-3">
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="text-center mt-3">
          {successMessage}
        </Alert>
      )}
    </div>
  );
};

export default SignupScreen;
