import { SyntheticEvent, useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';
import { UserState } from '../reducers/userReducers';
import { RootState } from '../store';
import './LoginScreen.css'; // Link to custom styling

interface Props {
  history: RouteComponentProps['history'];
}

const LoginScreen = ({ history }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const userLogin = useSelector<RootState, UserState>(
    (state: RootState) => state.userLogin
  );
  const { userInfo, error } = userLogin;

  useEffect(() => {
    if (userInfo !== undefined && userInfo.firstName) {
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        setSuccessMessage(null); // Clear message after 3 seconds
        history.push('/');
      }, 3000);
    } else if (error) {
      setErrorMessage(error);
    }
  }, [userInfo, error, history]);

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset any previous errors
    dispatch(login(email, password));
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="my-3 login-button">
          Login
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

export default LoginScreen;
