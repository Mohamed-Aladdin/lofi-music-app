/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/services/coreAPI';
import { Loader, Error } from '../components';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    name: undefined,
    username: undefined,
    email: undefined,
    phone: undefined,
    country: undefined,
    password: undefined,
    confirmPassword: undefined,
  });
  const navigate = useNavigate();
  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();

  const handleChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (userInfo.password !== userInfo.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await registerUser(userInfo).unwrap();
      navigate('/');
    } catch (err) {
      console.error({ error: err.stack });
      alert('User already exists!');
    }
  };

  if (isLoading) return <Loader title="Processing your request..." />;
  if (error) return <Error />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#121286]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Full Name <span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username <span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email <span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-white"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-white"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.country}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password <span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password <span className="text-red-600 text-xl">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userInfo.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2a2a80] text-white font-semibold py-2 rounded hover:bg-[#121286] transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
