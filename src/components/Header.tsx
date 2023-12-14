import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Default from '@/assets/default.png';
import { Button } from '@/components/ui/button';

import { IoIosNotificationsOutline } from 'react-icons/io';
export default function Header() {
  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [image, setImage] = useState('');

  const fetchUserDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/user.php`, {
        params: {
          user_id: localStorage.getItem('bidding'),
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
    localStorage.removeItem('bidding');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="fixed top-0 flex justify-between items-center h-[7rem] bg-orange-500 w-full p-4 border-b-2 text-white">
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
          <Link to="/profile">
            <Button className="bg-orange-800">Profile</Button>
          </Link>

          {image && (
            <img
              className="rounded-full w-[4rem] h-[4rem] object-cover cursor-pointer"
              src={image.length > 0 ? image : Default}
              alt=""
            />
          )}
        </div>

        {showProfileMenu && (
          <div className="absolute border-2 w-[20rem] left-[20rem] flex flex-col justify-center items-center bg-white rounded-md p-2">
            <p className="cursor-pointer" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
