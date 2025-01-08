import React, { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiSettings, FiSun, FiMoon, FiX, FiPlus } from 'react-icons/fi';
import { IoIosCreate } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { CiDark } from "react-icons/ci";
import { ImUser } from "react-icons/im";
import { useTheme } from '../contexts/ThemeContext';
import { Modal, Button, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Nav = ({ onSidebarToggle, history, setHistory }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const savedTheme = Cookies.get('theme');
    if (savedTheme) {
      if (savedTheme === 'dark' && !darkMode) {
        toggleTheme();
      } else if (savedTheme === 'light' && darkMode) {
        toggleTheme();
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    onSidebarToggle(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveNewChat = () => {
    if (newChatName.trim()) {
      setHistory([...history, { name: newChatName, conversation: [] }]);
      setNewChatName('');
    }
    setShowModal(false);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    Cookies.set('theme', darkMode ? 'light' : 'dark', { expires: 365 });
  };

  return (
    <>
      {!isSidebarOpen ? (
        <button onClick={toggleSidebar} className="nav__icon nav__icon--menu">
          <FiMenu size={24} />
        </button>
      ) : (<></>)}
      
      <div className={`nav__sidebar ${isSidebarOpen ? 'nav__sidebar--open' : ''}`}>
        <button onClick={toggleSidebar} className="nav__icon nav__icon--close">
          <FiX size={24} />
        </button>
        <div className="nav__history">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className='mt-1'>History</h6>
            <button className="nav__icon nav__icon--new-chat" onClick={handleNewChat}>
              <IoIosCreate size={24} />
            </button>
          </div>
          <ul>
            {history.map((chat, index) => (
              <li key={index}><button>{chat.name}</button></li>
            ))}
          </ul>
        </div>

        <div className="nav__bottom">
          <button className="nav__icon me-2" style={{padding:"5px 15px !important"}}>
            <ImUser size={24} />
          </button>
          <button className="nav__icon me-2">
            <IoIosSettings size={24} />
          </button>
          <button onClick={handleToggleTheme} className="nav__icon">
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>New Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewChatName">
              <Form.Label>Conversation Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter conversation name"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewChat}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Nav;