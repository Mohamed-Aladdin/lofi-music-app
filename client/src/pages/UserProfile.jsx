/* eslint-disable no-alert */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  useGetUserDetailsQuery,
  useResetPasswordMutation,
} from '../redux/services/coreAPI';
import { Loader, Error } from '../components';

const UserProfile = ({ handleFavorites }) => {
  const { data: user, isFetching, error, refetch } = useGetUserDetailsQuery();
  const [resetPassword] = useResetPasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    refetch();
  }, [handleFavorites]);

  useEffect(() => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;

    try {
      await resetPassword({ currentPassword, password });
      setSuccessMessage('Password reset successful!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error({ error: err.stack });
      alert('Failed to reset password, please try again later.');
    }
  };

  if (isFetching) return <Loader title="Loading your profile..." />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col items-center p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm rounded-lg w-full">
      <h2 className="text-3xl font-bold text-white mb-5">User Profile</h2>
      <div className="w-full mt-4">
        <div className="flex flex-col text-white">
          <div className="flex justify-between mb-5">
            <p className="font-bold">Full Name:</p>
            <p>{user.name}</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Username:</p>
            <p>{user.username}</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Email:</p>
            <p>{user.email}</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Phone:</p>
            <p>{user.phone}</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Country:</p>
            <p>{user.country || 'Not provided'}</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Playlists:</p>
            <p>{user.playlists.length} playlists</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Favorited Songs:</p>
            <p>{user.favoritedSongs.length} songs</p>
          </div>
          <div className="flex justify-between mb-5">
            <p className="font-bold">Shared Playlists:</p>
            <p>{user.sharedPlaylists.length} playlists</p>
          </div>
        </div>
      </div>

      <div className="w-full mt-6">
        <h3 className="text-xl font-bold text-white">Reset Password</h3>
        <form onSubmit={handlePasswordReset} className="flex flex-col mt-2">
          <input
            type="password"
            className="p-2 rounded-lg bg-gray-200 text-black mb-4 mt-2"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="p-2 rounded-lg bg-gray-200 text-black mb-2"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="p-2 rounded-lg bg-gray-200 text-black mt-2"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-red-500 mt-2">{passwordError}</p>
          )}
          <button
            type="submit"
            className="p-2 rounded-lg bg-blue-500 text-white mt-8"
            disabled={passwordError || !password}
          >
            Reset Password
          </button>
        </form>
        {successMessage && (
          <p className="text-green-500 mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
