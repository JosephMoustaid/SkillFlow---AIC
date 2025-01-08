import React, { useState, useEffect } from 'react';
import { FaGoogle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo-no-bg.png';
import bgvideo from '../assets/videos/bg2.mp4';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState(false);
  const [preference , setPreference] = useState('');
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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordMatch(newPassword === confirmPassword);
    setPasswordCriteria(newPassword.length >= 8); // Example criteria: at least 8 characters
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMatch && passwordCriteria) {
      try {
        const response = await fetch('http://localhost:4200/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            preference
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Redirect to sign in page on successful signup
          navigate('/sign-in');
        } else {
          setError(data.error || 'Failed to sign up');
        }
      } catch (err) {
        setError('Network error - please try again later');
        console.error('Signup error:', err);
      }
    }
  };

  const isValidInput = (value) => value.trim() !== '';

  return (
    <div className="sign-up-container d-flex vh-100 flex-column flex-md-row" style={{ position: 'relative', overflow: 'hidden' }}>
      <video autoPlay muted loop style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
        <source src={bgvideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="ms-3 left-section text-start text-md-start text-center d-flex flex-column justify-content-start justify-content-md-start align-items-start align-items-md-start align-items-center p-4" style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', textAlign: 'center', zIndex: 1 }}>
        <h1 className="">
            <span className='fw-light fs-5 ms-2'>Welcome to</span>
            <span className='d-flex justify-content-start align-items-center'>
                <img src={logo} alt="SkillFlow" className="logo px-0" style={{ maxHeight: '50px', maxWidth: '50px' }} />
                <span className='fw-bold text-primary'>SkillFlow.</span>
            </span>
        </h1>
        <p>Join us and enhance your skills with the best mentors.</p>
      </div>
      <div className="right-section d-flex justify-content-center align-items-center w-100" style={{ width: '100%', zIndex: 1 }}>
        <div className="sign-up-box bg-light p-4 rounded shadow-sm text-center w-100" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4   text-primary fw-bold">Sign Up</h2>
          
          {/* Show error message if exists */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative mb-3">
              <input
                type="text"
                id="firstName"
                className="form-control"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {isValidInput(firstName) && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <div className="form-group position-relative mb-3">
              <input
                type="text"
                id="lastName"
                className="form-control"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {isValidInput(lastName) && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
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
                onChange={handlePasswordChange}
              />
              {passwordCriteria && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <div className="form-group position-relative mb-3">
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {passwordMatch && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <div className="form-group position-relative mb-3">
              <input
                type="text"
                id="preference"
                className="form-control"
                placeholder="Enter your preference"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              />
              {isValidInput(preference) && <FaCheck className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={!firstName || !lastName || !email || !passwordMatch || !passwordCriteria || !preference}
            >
              Sign Up
            </button>
          </form>
          <div className="divider my-3">or</div>
          <button className="btn btn-google w-100 mb-3">
            <FaGoogle className="google-icon me-2" /> Sign Up with Google
          </button>
          <a href="sign-in" className="text-decoration-none">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;