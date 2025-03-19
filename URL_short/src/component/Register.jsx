import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config'; 
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Email and Password Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*]).{8,}$/;

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        'Password must be at least 8 characters long, with one uppercase, one lowercase, one number, and one special character'
      );
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, formData);
      alert('An OTP has been sent to your email. Please verify to continue.');
      setIsVerifying(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  // ✅ Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/user/verify-otp`, {
        email: formData.email,
        otp
      });

      alert(response.data.message);
      setFormData({ name: '', email: '', password: '' });
      setOtp('');
      setIsVerifying(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        {/* ✅ Header */}
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          {isVerifying ? 'Verify Your Account' : 'Create an Account'}
        </h2>

        {/* ✅ OTP Verification Form */}
        {isVerifying ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Verify OTP
            </button>
          </form>
        ) : (
          // ✅ Registration Form
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Set Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <ul className="mt-2 text-gray-500 text-sm list-disc pl-4">
                <li>✅ At least 8 characters</li>
                <li>✅ At least one uppercase letter</li>
                <li>✅ At least one lowercase letter</li>
                <li>✅ At least one number</li>
                <li>✅ At least one special character (@, #, $, %, etc.)</li>
              </ul>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Register
            </button>
          </form>
        )}

        {!isVerifying && (
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
