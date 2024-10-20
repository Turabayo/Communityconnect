import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignScreen';
import Profile from './screens/Profile';
import SearchScreen from './screens/SearchScreen';
import BookingScreen from './screens/BookingScreen'; // New booking screen 
import ProviderBookingsScreen from './screens/ProviderBookingsScreen';
import ConsumerBookingsScreen from './screens/ConsumerBookingsScreen';
import ChatScreen from './screens/ChatScreen'; // New chat screen

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/' exact component={HomeScreen} />
          <Route path='/signup' component={SignupScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/profile' component={Profile} /> 
          <Route path="/search" component={SearchScreen} /> 
          <Route path="/book" component={BookingScreen} /> 
          <Route path="/provider/bookings" component={ProviderBookingsScreen} />  
          <Route path="/consumer/bookings" component={ConsumerBookingsScreen} />  
          <Route path="/chat" component={ChatScreen} /> {/* Add chat screen route */}
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
