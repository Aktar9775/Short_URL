import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email and Password Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*]).{8,}$/;

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Handle Form Submission
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
      const response = await axios.post('http://localhost:8002/user/login', formData);

      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      navigate('/shorten');
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  // ✅ Handle Forgot Password Request
  const handleForgotPassword = async () => {
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8002/user/forgot-password', {
        email: formData.email,
      });

      alert(response.data.message);
      setShowOtpModal(true); // Open OTP modal
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  // ✅ Handle OTP Verification and Password Reset
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8002/user/verify-otp', {
        email: formData.email,
        otp,
      });

      alert(response.data.message);
      setResetPassword(true); // Allow password reset after OTP verification
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    }
  };

  // ✅ Handle New Password Submission
  const handleResetPassword = async () => {
    if (!passwordRegex.test(newPassword)) {
      setError(
        'Password must be at least 8 characters long, with one uppercase, one lowercase, one number, and one special character'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:8002/user/reset-password', {
        email: formData.email,
        newPassword,
      });

      alert(response.data.message);
      setShowOtpModal(false);
      setResetPassword(false);
      setFormData({ email: '', password: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Sign In</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {/* Forgot Password Link */}
            <p
              className="text-right text-sm text-blue-500 cursor-pointer mt-1 hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* ✅ OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            {!resetPassword ? (
              <>
                <h3 className="text-xl font-bold mb-4">Verify OTP</h3>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Set New Password</h3>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
                <button
                  onClick={handleResetPassword}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
