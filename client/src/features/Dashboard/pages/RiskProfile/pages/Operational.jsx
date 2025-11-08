import React from 'react';

export const Operational = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Operational Risk Details</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Operational Risk Assessment Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Department</option>
              <option value="finance">Finance</option>
              <option value="hr">Human Resources</option>
              <option value="it">Information Technology</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Category</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Category</option>
              <option value="process">Process Failure</option>
              <option value="people">People Risk</option>
              <option value="systems">Systems Risk</option>
              <option value="external">External Risk</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Description</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Describe the operational risk factors"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Probability</option>
              <option value="low">Low (0-30%)</option>
              <option value="medium">Medium (31-70%)</option>
              <option value="high">High (71-100%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Impact</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Operational Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operational
