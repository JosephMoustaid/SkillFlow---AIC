import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoAddOutline } from "react-icons/io5";
import { Dropdown } from 'react-bootstrap'; // Import Bootstrap dropdown
import logo from '../images/logo-no-bg.png';
import { IoMdArrowDropdownCircle } from "react-icons/io";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/sign-in'; // Redirect to sign-in page
  };

  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-3">
      <div className='col-2'>
        <a href="/paths" className="btn btn-outline-light shadow mx-2 fw-bold">
          <span className='me-1'>
            <IoAddOutline />
          </span>
          New Path
        </a>
      </div>
      <a href='/dashboard' className="d-flex align-items-center text-decoration-none text-white">
        <img src={logo} alt="SkillMentor" className="logo" style={{ maxHeight: '40px', maxWidth: '40px', marginRight: '0.5rem' }} />
        <span className="logo-text fs-3 fw-bold">SkillFlow</span>
      </a>
      <div >
        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            <a href="/dashboard" className="btn btn-outline-light shadow mx-2 fw-bold">
          <span className='me-1'>
            < IoMdArrowDropdownCircle />
          </span>
          My Learning Paths
        </a>
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" className="fw-bold">
              <FaUser />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item href="settings">Settings</Dropdown.Item>
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div>
        ) : (
          <>
            <a href='sign-in' className="btn btn-outline-light me-2 fw-bold">Sign in</a>
            <a href='sign-up' className="btn btn-primary fw-bold">Sign up</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
