import React from 'react';

const Path = ({ title, imageUrl }) => {
  return (
    <div className='col-3 p-0 position-relative'>
      <img
        src={imageUrl}
        className='w-100 rounded'
        alt={title}
        style={{ objectFit: 'cover', height: '200px' , filter: 'brightness(0.7)' }}
      />
      <div className="position-absolute text-center  top-50 start-50 translate-middle  fs-3 fw-bold">
        {title}
      </div>
    </div>
  );
};

export default Path;