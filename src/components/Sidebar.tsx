import React from 'react';
import { Link } from 'react-router-dom';

import Default from '../assets/default.png';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdEditNote } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
export default function Sidebar({
  setShowMotorInput,
  showMotorInput,
}: {
  setShowMotorInput: any;
  showMotorInput: boolean;
}) {
  const user_id = localStorage.getItem('motor_socmed') as string;
  const [image, setImage] = useState('' as string);
  const [user, setUser] = useState({
    address: '',
    birthday: '',
    email: '',
    gender: '',
    name: '',
    password: '',
    profile_picture: '',
    user_id: '',
  });

  const fetchUserDetails = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/user.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('success');

          setImage(res.data[0].profile_picture);
          setUser(res.data[0]);
          console.log(res.data);
        }
      });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('motor_socmed');
    window.location.href = '/login';
  };
  return (
    <div className="flex flex-col h-[80%] justify-between mt-[10rem] fixed left-0 p-5 w-[20rem] z-40 bg-white rounded-lg">
      <div>
        <div className="flex items-center my-4">
          <img
            className="rounded-full w-[4rem] h-[4rem] object-cover cursor-pointer"
            src={image.length > 0 ? image : Default}
            alt=""
          />
          <div>
            <h1 className="font-bold text-2xl cursor-pointer hover:text-blue-500 ">
              {user.name}
            </h1>
            <p>{user.email}</p>
          </div>
        </div>
        <Link to={`/`}>
          <h1 className="w-full mb-2 cursor-pointer hover:text-blue-500 font-bold flex py-3">
            <FaHome className="w-[1.5rem] h-[1.5rem] mr-2" /> Home
          </h1>
        </Link>
        <h1
          className="w-full cursor-pointer hover:text-blue-500 font-bold flex py-3"
          onClick={() => setShowMotorInput(!showMotorInput)}
        >
          <MdEditNote className="w-[1.5rem] h-[1.5rem] mr-2" />{' '}
          {showMotorInput ? 'Close' : 'Post Now'}
        </h1>

        <Link to={`/post/${user_id}`}>
          <h1 className="w-full mt-2 cursor-pointer hover:text-blue-500 font-bold flex py-5">
            <MdOutlineNoteAlt className="w-[1.5rem] h-[1.5rem] mr-2" /> Your
            Posts
          </h1>
        </Link>
      </div>

      <div className="w-full block">
        <h1
          onClick={handleLogout}
          className="w-full cursor-pointer hover:text-blue-500 font-bold flex py-5d"
        >
          <CiLogout className="w-[1.5rem] h-[1.5rem] mr-2" /> Logout
        </h1>
      </div>
    </div>
  );
}
