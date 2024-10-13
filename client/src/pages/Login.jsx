/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable operator-linebreak */
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticateUserMutation } from '../redux/services/coreAPI';
import { Loader, Error } from '../components';

const Login = ({ onLogin }) => {
  const [userCreds, setUserCreds] = useState({
    email: undefined,
    password: undefined,
  });
  const navigate = useNavigate();
  const [authenticateUser, { isLoading, isError, error }] =
    useAuthenticateUserMutation();

  const handleChange = (e) => {
    setUserCreds((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await authenticateUser(userCreds).unwrap();
      window.localStorage.setItem('userId', res.id);
      window.localStorage.setItem('x-token', res.token);
      window.localStorage.setItem(
        'token-expiration',
        Date.now() + 24 * 60 * 60 * 1000
      );
      onLogin(!!window.localStorage.getItem('x-token'));
    } catch (err) {
      console.error({ error: err.stack });
      alert('Wrong username or password!');
    }
    navigate('/');
  };

  if (isLoading) return <Loader title="Processing your request..." />;
  if (error) return <Error />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#121286]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userCreds.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 bg-black text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#2a2a80]"
              value={userCreds.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2a2a80] text-white font-semibold py-2 rounded hover:bg-[#121286] transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-white mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-cyan-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
