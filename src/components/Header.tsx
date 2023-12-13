import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Default from '@/assets/default.png';

import Notification from './Notification';
import { IoIosNotificationsOutline } from 'react-icons/io';
export default function Header() {
  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [image, setImage] = useState('');

  const [showNotificationHeader, setShowNotificationHeader] = useState(false);

  const fetchUserDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/user.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('success');
          setUser(res.data[0]);
          setName(res.data[0].name);
          setImage(res.data[0].profile_picture);
          console.log(res.data);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('motor_socmed');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="fixed top-0 flex justify-between items-center h-[7rem] bg-white w-full p-4 border-b-2">
      <div className="p-2 ">
        <Link to="/">
          {' '}
          <h1 className="text-2xl font-bold cursor-pointer">Hello, {name}</h1>
        </Link>

        <p className="text-sm">
          Welcome to Project Bidding, a place where you can bid your project
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-5 items-center">
          <IoIosNotificationsOutline
            onClick={() => setShowNotificationHeader(!showNotificationHeader)}
            className="w-[2rem] h-[2rem] mr-2 text-blue-500 cursor-pointer"
          />

          <img
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="rounded-full w-[4rem] h-[4rem] object-cover cursor-pointer"
            src={image.length > 0 ? image : Default}
            alt=""
          />
        </div>

        {showProfileMenu && (
          <div className="absolute border-2 w-[10rem] left-[10rem] flex flex-col justify-center items-center bg-white rounded-md p-2">
            <Link to="/profile">
              <p>Profile</p>
            </Link>

            <p className="cursor-pointer" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>

      {showNotificationHeader && (
        <div className="absolute mt-[2rem] w-[30rem] border-2 right-20 top-24 rounded-lg overflow-hidden">
          <Notification />
        </div>
      )}
    </div>
  );
}
