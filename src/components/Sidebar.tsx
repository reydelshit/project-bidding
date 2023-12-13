import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdEditNote } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
export default function Sidebar({
  setShowBiddingFormInput,
  showBiddingFormInput,
}: {
  setShowBiddingFormInput: any;
  showBiddingFormInput: boolean;
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
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/user.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        setImage(res.data[0].profile_picture);
        setUser(res.data[0]);
        console.log(res.data);
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
    <div className="flex flex-col h-[80%] justify-between mt-[10rem] fixed left-0 p-5 w-[15rem] z-40 bg-orange-500 text-white rounded-lg ml-2">
      <div>
        <div className="flex items-center my-4">
          <div>
            <h1 className="font-bold text-2xl cursor-pointer hover:text-orange-800 ">
              {user.name}
            </h1>
            <p>{user.email}</p>
          </div>
        </div>
        <Link to={`/`}>
          <h1 className="w-full mb-2 cursor-pointer hover:text-orange-800 font-bold flex py-3">
            <FaHome className="w-[1.5rem] h-[1.5rem] mr-2" /> Home
          </h1>
        </Link>
        <h1
          className="w-full cursor-pointer hover:text-orange-800 font-bold flex py-3"
          onClick={() => setShowBiddingFormInput(!showBiddingFormInput)}
        >
          <MdEditNote className="w-[1.5rem] h-[1.5rem] mr-2" />{' '}
          {showBiddingFormInput ? 'Close' : 'Post Project'}
        </h1>

        <Link to={`/post/yourpost/${user_id}`}>
          <h1 className="w-full mt-2 cursor-pointer hover:text-orange-800 font-bold flex py-5">
            <MdOutlineNoteAlt className="w-[1.5rem] h-[1.5rem] mr-2" /> Your
            Posts
          </h1>
        </Link>
      </div>

      <div className="w-full block">
        <h1
          onClick={handleLogout}
          className="w-full cursor-pointer hover:text-orange-800 font-bold flex py-5d"
        >
          <CiLogout className="w-[1.5rem] h-[1.5rem] mr-2" /> Logout
        </h1>
      </div>
    </div>
  );
}
