import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import './css/style.css';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Paths from './pages/Paths';
import Dashboard from './pages/Dashboard';
import Path from './pages/Path';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/path/:id" element={<Path />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;