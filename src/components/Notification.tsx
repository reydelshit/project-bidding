import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Notification = {
  notifcation_id: number;
  created_at: string;
  notification_message: string;
  receiver_id: number;
  sender_id: number;
};
export default function Notification() {
  const [notification, setNotification] = useState<Notification[]>([]);
  const userId = Number(localStorage.getItem('motor_socmed'));

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_MOTOR_MARKETPLACE}/notification.php`,
        {
          params: { receiver_id: userId },
        },
      );
      console.log(response.data, 'notif');

      if (Array.isArray(response.data) && response.data.length > 0) {
        setNotification(response.data);
      } else {
        setNotification([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      //   setDataFetched(false);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div className="bg-white p-4">
      <h1>You have {notification.length} notifications</h1>

      <div className="h-[20rem] block overflow-x-auto">
        {notification.length > 0 ? (
          notification.map((noti, index) => {
            return (
              <div
                className="border-2 p-2 mt-[1rem] rounded-sm bg-gray-100"
                key={index}
              >
                <Link to={`/post/${userId}`}>
                  <p className="cursor-pointer">{noti.notification_message}</p>{' '}
                </Link>

                <p> {moment(noti.created_at).format('LLL')}</p>
              </div>
            );
          })
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
}
