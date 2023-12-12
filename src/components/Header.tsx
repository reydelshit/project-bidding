import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Default from '@/assets/default.png';
import { MainContext } from './context/useMainContext';
import Message from './Message';
import Notification from './Notification';
import { LuMessagesSquare } from 'react-icons/lu';
import { IoIosNotificationsOutline } from 'react-icons/io';
export default function Header() {
  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [image, setImage] = useState('');

  // const { showMessage, setShowMessage } = useContext(MainContext);
  const [showMessageHeader, setShowMessageHeader] = useState(false);
  const [showNotificationHeader, setShowNotificationHeader] = useState(false);

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
          Welcome to Motor Connections where you can flex your motorcylce
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-5 items-center">
          <Button
            onClick={() => setShowNotificationHeader(!showNotificationHeader)}
          >
            <IoIosNotificationsOutline className="w-[1.5rem] h-[1.5rem] mr-2" />
            Notification
          </Button>
          <Button onClick={() => setShowMessageHeader(!showMessageHeader)}>
            <LuMessagesSquare className="w-[1.5rem] h-[1.5rem] mr-2" /> Message
          </Button>
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

      {showMessageHeader && (
        <div className="absolute mt-[2rem] w-[30rem] border-2 right-20 top-24 rounded-lg overflow-hidden">
          <Message />
        </div>
      )}

      {showNotificationHeader && (
        <div className="absolute mt-[2rem] w-[30rem] border-2 right-20 top-24 rounded-lg overflow-hidden">
          <Notification />
        </div>
      )}
    </div>
  );
}
