import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import App from '@/App';
import Header from '../Header';
import { MainContext } from '../context/useMainContext';
import SendMessage from '../SendMessage';

export default function Root() {
  const location = useLocation();

  const isLogin = localStorage.getItem('motor_socmed');
  const [showMessage, setShowMessage] = useState(false);
  const [recepientIDNumber, setRecepientIDNumber] = useState(0);

  if (!isLogin) {
    return (window.location.href = '/login');
  }

  return (
    <div className="w-full border-2 relative">
      <div className="flex border-2">
        <div className="w-full px-2">
          <MainContext.Provider
            value={{
              recepientIDNumber,
              setRecepientIDNumber,
              showMessage,
              setShowMessage,
            }}
          >
            {location.pathname === '/' ? <App /> : <Outlet />}
            {showMessage && <SendMessage />}
          </MainContext.Provider>
        </div>
      </div>
    </div>
  );
}
