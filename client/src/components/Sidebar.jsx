/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { logo } from '../assets';
import { links } from '../assets/constants';
import { useLogoutUserMutation } from '../redux/services/coreAPI';

const NavLinks = ({ handleClick, handleLogout }) => (
  <div className="mt-10">
    {links.map((link) => (
      <NavLink
        key={link.name}
        to={link.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400"
        onClick={(e) => {
          if (link.name === 'Logout') {
            e.preventDefault();
            handleLogout();
          } else {
            handleClick && handleClick();
          }
        }}
      >
        <link.icon className="w-6 h-6 mr-2" />
        {link.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = ({ onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('x-token');
      window.localStorage.removeItem('token-expiration');
      onLogout(!!window.localStorage.getItem('x-token'));
    } catch (err) {
      console.error({ error: err.stack });
      alert('Please try again later.');
    }
  };

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191624]">
        <img src={logo} alt="logo" className="w-full h-[12%] object-contain" />
        <NavLinks handleLogout={handleLogout} />
      </div>

      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(true)}
          />
        ) : (
          <RiCloseLine
            className="w-6 h-6 text-white mr-2"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483d8b] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? 'left-0' : '-left-full'
        }`}
      >
        <img src={logo} alt="logo" className="w-full h-14 object-contain" />
        <NavLinks
          handleClick={() => setMobileMenuOpen(false)}
          handleLogout={handleLogout}
        />
      </div>
    </>
  );
};

export default Sidebar;
