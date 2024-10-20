import { useEffect, useState } from 'react';
import { SyntheticEvent } from 'react';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { UserState } from '../reducers/userReducers';
import { RootState } from '../store';
import { logout } from '../actions/userActions';

interface UserInfo {
  firstName?: string;
  lastName?: string;
  role?: string;  // Add role property
  profilePicture?: string;
}

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector<RootState, { userInfo: UserInfo }>(
    (state: RootState) => state.userLogin
  );
  const { userInfo } = userLogin;
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const logoutHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(logout());
    setSuccessMessage('Logout successful!');
    setTimeout(() => {
      setSuccessMessage(null); // Clear message after 3 seconds
    }, 3000);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">Community Connect</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo ? (
              <Nav className="ms-auto">
                <Nav.Link href="/search">Search</Nav.Link>
                <Nav.Link href="/chat">Chat</Nav.Link> {/* Link to chat */}

                {/* Links based on user role */}
                {userInfo.role === 'provider' && (
                  <Nav.Link href="/provider/bookings">My Provider Bookings</Nav.Link>
                )}
                {userInfo.role === 'consumer' && (
                  <Nav.Link href="/consumer/bookings">My Consumer Bookings</Nav.Link>
                )}

                <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {successMessage && (
        <Alert variant="success" className="text-center mt-3">
          {successMessage}
        </Alert>
      )}
    </>
  );
};

export default Header;
