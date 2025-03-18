import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UrlList() {
  const [urls, setUrls] = useState([]);
  const [formData, setFormData] = useState({ redirectURL: '' });
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name);
      fetchUrls();
      setupSSE();
    }
  }, []);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in. Please log in again.');
        navigate('/login');
        return;
      }
      const response = await axios.get('http://localhost:8002/url/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleEdit = (id) => {
    console.log(`Editing URL with id: ${id}`);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await axios.delete(`http://localhost:8002/url/${id}`);
        alert('URL deleted successfully!');
        fetchUrls();
      } catch (error) {
        console.error('Delete Error:', error);
        alert('Failed to delete URL');
      }
    }
  };
  const setupSSE = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const eventSource = new EventSource(`http://localhost:8002/url/updates?token=${token}`);
    eventSource.onmessage = (event) => {
      const updatedUrls = JSON.parse(event.data);
      setUrls(updatedUrls);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.redirectURL) {
      alert('Please enter a valid URL');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8002/url',
        { url: formData.redirectURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // alert(response.data.message || 'Short URL created successfully!');
      setFormData({ redirectURL: '' });
      fetchUrls();
    } catch (error) {
      console.error('POST Error:', error.response?.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const filteredUrls = urls.filter((url) =>
    url.redirectURL.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 tracking-wide"> URL Shortener</h1>
        <div className="flex items-center space-x-4">
          {username && <span className="text-blue-800 font-medium">👤 {username}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            name="redirectURL"
            value={formData.redirectURL}
            onChange={handleChange}
            placeholder="Paste the URL to shorten...https://www.example.com"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Shorten
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mt-6">
        <input
          type="text"
          placeholder="Search URLs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* URL List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {filteredUrls.length > 0 ? (
      filteredUrls.map((url) => (
        <div
          key={url._id}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              src={
                url.image ||
                `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`
              }
              alt="Thumbnail"
              className="w-full h-[250px] object-cover"
            />
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-2 rounded-lg text-1xl ">
              Visits: {url.visitHistory.length}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              Short Url: 
              <a
                href={`http://localhost:8002/${url.shortId}`}
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {url.shortId}
              </a>
            </h3>
            <p className="mt-2 text-sm text-gray-600 break-all">
              <span className="font-medium">Redirect URL:</span> {url.redirectURL}
            </p>
          </div>

          {/* Button Section */}
          <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => handleEdit(url._id)}
              className="flex items-center gap-2 text-blue-600 text-sm px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => handleDelete(url._id)}
              className="flex items-center gap-2 text-red-500 text-sm px-4 py-2 rounded-md hover:bg-red-100 transition"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 font-semibold mt-4">
        No URLs found. Start shortening now!
      </p>
    )}
  </div>

    </div>
  );
}

export default UrlList;
