import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Path from '../components/Path';

const Dashboard = () => {
  const [paths, setPaths] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([
    { title: 'Web Development', imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { title: 'Data Science', imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { title: 'Machine Learning', imageUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ]);

  useEffect(() => {
    const fetchUserPaths = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:4200/path/myPaths', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPaths(data);
      } catch (error) {
        console.error('Error fetching user paths:', error);
      }
    };

    fetchUserPaths();
  }, []);

  return (
    <div className="container-fluid  min-vh-100">
      {/* Header */}
      <Header />

      <div className="container py-4">
        {/* My Learning Paths Section */}
        <section className="mb-5">
          <h2 className="fw-bold mb-3">My Learning Paths</h2>
          {paths.length > 0 ? (
            paths.map((path, index) => (
              <div
                key={index}
                className="d-flex my-4 justify-content-between align-items-center rounded p-3 mb-3"
                style={{ borderRadius: '10px' }}
              >
                <div>
                  <h5 className="mb-1 fw-bold">{path.name}</h5>
                  <small className='opacity-75 fw-light'>Started on {new Date(path.created_at).toLocaleDateString()}</small>
                </div>
                <span className="fw-bold" style={{ fontSize: '1.25rem' }}>
                  {path.progress || 0}%
                </span>
                <a href={`/path/${path.idpath}`} className="btn btn-primary fw-bold">Continue My Learning</a>
              </div>
            ))
          ) : (
            <p className='text-center opacity-75 my-5'>No learning paths available</p>
          )}
        </section>

        {/* Recommended Paths Section */}
        <section>
          <h2 className="fw-bold mb-3">Recommended Paths</h2>
          <div className="row gap-5 my-5 d-flex align-items-center justify-content-between flex-wrap">
            {recommendedPaths.map((path, index) => (
              <Path key={index} title={path.title} imageUrl={path.imageUrl} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
