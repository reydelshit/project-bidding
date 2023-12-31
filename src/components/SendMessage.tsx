// import Cake from '@/assets/cake.png';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useContext, useEffect, useState } from 'react';
import Default from '@/assets/default.png';
import axios from 'axios';
import moment from 'moment';

import { MainContext } from './context/useMainContext';

type MessageType = {
  created_at: string;
  message_context: string;
  receiver_id: string;
  sender_id: number;
  profile_picture: string;
  sender_username: string;
  user_id: number;
};

export default function SendMessage() {
  const { recepientIDNumber, showMessage, setShowMessage } =
    useContext(MainContext);

  const [message, setMessage] = useState('');
  const [recepientMessage, setRecepientMessage] = useState<MessageType[]>([]);

  const userId = Number(localStorage.getItem('bidding'));

  const getMessageRecepient = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/message-fetch.php`, {
        params: {
          sender_id: userId,
          receiver_id: recepientIDNumber,
        },
      })
      .then((res) => {
        console.log(res.data, 'get message recepient');
        setRecepientMessage(res.data);
      });
  };

  useEffect(() => {
    getMessageRecepient();
  }, []);

  const handleMessageSent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${import.meta.env.VITE_PROJECT_BIDDING}/message.php`, {
        sender_id: userId,
        receiver_id: recepientIDNumber,
        message_context: message,
      })
      .then((res) => {
        console.log(res.data, 'message sent');
        getMessageRecepient();
        setMessage('');
      });
  };

  return (
    <div className="bg-white h-[30rem] w-[30rem] border-2  bottom-0 fixed right-10 p-4 rounded-lg">
      <div className="flex items-center justify-between border-b-2 p-2">
        {recepientMessage
          .filter((res) => res.user_id === recepientIDNumber)
          .map((res, index) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <img
                  className="w-[6rem] h-[6rem] rounded-full object-cover"
                  src={res.profile_picture ? res.profile_picture : Default}
                  alt=""
                />
                <h1 className="font-bold">{res.sender_username}</h1>
              </div>
            );
          })
          .slice(0, 1)}

        <Button onClick={() => setShowMessage(false)}>Close</Button>
      </div>
      <div className="overflow-x-auto h-[17rem]">
        {recepientMessage.length > 0 &&
          recepientMessage
            .filter((res) => !res.receiver_id.includes('No'))
            .map((res, index) => {
              return (
                <div
                  key={index}
                  className={`border-2 p-2 mt-[1rem] rounded-sm  ${
                    parseInt(res.receiver_id) === userId
                      ? 'bg-gray-200'
                      : 'bg-blue-600 !text-white'
                  } text-start`}
                >
                  <p>{res.message_context}</p>
                  <p className="text-xs">
                    {moment(res.created_at).format('LLL')}
                  </p>
                </div>
              );
            })}
      </div>

      <div className="h-[4rem] absolute bottom-2 w-[90%] flex p-2 gap-5">
        <form className="w-full flex gap-4" onSubmit={handleMessageSent}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            required
          />

          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
