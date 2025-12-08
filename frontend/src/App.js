// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import RegisterNGO from './pages/RegisterNGO';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Resqnet</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/report">Report Animal</Link>
            <Link to="/register-ngo">NGO Registration</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/register-ngo" element={<RegisterNGO />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

