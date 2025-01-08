import React, { useState, useEffect } from 'react';
import { FaGoogle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo-no-bg.png';
import bgvideo from '../assets/videos/bg2.mp4';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const setBackgroundColor = (element, color) => {
      element.style.setProperty('background-color', color, 'important');
    };

    setBackgroundColor(document.documentElement, 'transparent');
    setBackgroundColor(document.body, 'transparent');
    setBackgroundColor(document.querySelector('#root'), 'transparent');
    document.querySelectorAll('div').forEach(div => {
      setBackgroundColor(div, 'transparent');
    });

    return () => {
      setBackgroundColor(document.documentElement, '');
      setBackgroundColor(document.body, '');
      setBackgroundColor(document.querySelector('#root'), '');
      document.querySelectorAll('div').forEach(div => {
        setBackgroundColor(div, '');
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4200/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.user);
        navigate('/dashboard'); // Redirect to dashboard or home page
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error - please try again later');
      console.error('Signin error:', err);
    }
  };

  const isValidInput = (value) => value.trim() !== '';

  return (
    <div className="sign-up-container d-flex vh-100 flex-column flex-md-row" style={{ position: 'relative', overflow: 'hidden' }}>
      <video autoPlay muted loop style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
        <source src={bgvideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="ms-3 left-section text-start text-md-start text-center d-flex flex-column justify-content-start justify-content-md-start align-items-start align-items-md-start align-items-center p-4" style={{ maxWidth: '600px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', textAlign: 'center', zIndex: 1 }}>
        <h1 className="">
            <span className='fw-light fs-5  ms-2'>Welcome to</span>
            <span className='d-flex justify-content-start align-items-center'>
                <img src={logo} alt="SkillFlow" className="logo px-0" style={{ maxHeight: '50px', maxWidth: '50px' }} />
                <span className='fw-bold text-primary'>SkillFlow.</span>
            </span>
        </h1>
        <p>Join us and enhance your skills with the best mentors.</p>
      </div>
      <div className="right-section d-flex justify-content-center align-items-center w-100" style={{ maxWidth: '600px', zIndex: 1 }}>
        <div className="sign-up-box bg-light p-4 rounded shadow-sm text-center w-100" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4 fw-bold text-primary">Sign In</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative mb-3">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isValidInput(email) && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <div className="form-group position-relative mb-3">
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isValidInput(password) && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={!email || !password}
            >
              Sign In
            </button>
          </form>
          
          <div className="divider my-3">or</div>
          <button className="btn btn-google w-100 mb-3">
            <FaGoogle className="google-icon me-2" /> Sign In with Google
          </button>
          <a href="sign-up" className="text-decoration-none">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;