import React, { useState } from 'react';
import { uploadImage, createQuote } from '../services/api';
import { useNavigate } from 'react-router-dom';

const QuoteCreatePage = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const uploadResponse = await uploadImage(file);
      console.log('response from picture',uploadResponse);
      await createQuote(token, text, uploadResponse[0]?.url||"");
      navigate('/quotes');
    } catch (error) {
      alert('Failed to create quote');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a Quote
        </h2>
        <div className="space-y-4">
          <textarea
            placeholder="Enter your quote text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          />
          <div className="border-dashed border-2 p-6 rounded-lg text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer text-gray-600 hover:text-blue-500"
            >
              Drag and drop your file here or <u>browse</u>
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteCreatePage;
