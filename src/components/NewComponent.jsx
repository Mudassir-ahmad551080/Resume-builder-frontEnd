import React from 'react';

const NewComponent = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">New Component</h2>
      <p className="text-gray-600 mb-4">This is a newly created component with modern Tailwind CSS styling.</p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300">
        Click Me
      </button>
    </div>
  );
};

export default NewComponent;