import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Path from '../components/Path';

const SkillFlowPage = () => {
  const [paths, setPaths] = useState([
    { title: 'Web Development', imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { title: 'Web Development', imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { title: 'Web Development', imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ]);
  const [pathName, setPathName] = useState('');
  const [pathSector, setPathSector] = useState('');
  const navigate = useNavigate();

  const handleAddPath = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    console.log('Token:', token);
    try {
      const response = await fetch('http://localhost:4200/path/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: pathName, sector: pathSector })
      });

      if (response.ok) {
        const newPath = await response.json();
        setPaths([...paths, newPath]);
        setPathName('');
        setPathSector('');

        // Create associated ToDoList, Progress, and Conversation
        await fetch('http://localhost:4200/todolist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ idPath: newPath.idpath, tasks: [] })
        });

        await fetch('http://localhost:4200/progress/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ idPath: newPath.idpath, idUser: newPath.idUser })
        });

        await fetch('http://localhost:4200/conversation/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ idPath: newPath.idpath, messages: [] })
        });
        console.log('Path created successfully');
        console.log('New Path:', newPath.idpath);
        // Redirect to the new path page
        navigate(`/path/${newPath.idpath}`);
      } else {
        console.error('Failed to create path');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <React.Fragment>
      <Header />

      <main className="text-center py-3 ">
        <h2 className="mb-4 display-6 mt-5 text-white">Choose Your Learning Path</h2>

        <div className="mb-4 d-flex col-3 m-auto flex-column align-items-center">
          <input
            type="text"
            className="form-control d-inline-block w-100 mb-2"
            placeholder="Path Name"
            value={pathName}
            onChange={(e) => setPathName(e.target.value)}
          />
          <input
            type="text"
            className="form-control d-inline-block w-100 mb-2"
            placeholder="Path Sector"
            value={pathSector}
            onChange={(e) => setPathSector(e.target.value)}
          />
          <button className="btn btn-primary w-100 fw-bold" onClick={handleAddPath}>Add Path</button>
        </div>

        <p className="display-5 fw-bold text-white">OR</p>

        <h4 className="mb-4 display-6 text-white">Choose from our suggested paths:</h4>

        <div className='text-white d-flex gap-5 my-5 align-items-center justify-content-evenly flex-wrap'>
          {paths.map((path, index) => (
            <Path key={index} title={path.title} imageUrl={path.imageUrl} />
          ))}
        </div>
      </main>
    </React.Fragment>
  );
};

export default SkillFlowPage;
