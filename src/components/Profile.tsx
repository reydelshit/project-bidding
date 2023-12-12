import Header from './Header';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Default from '@/assets/default.png';
export default function Profile() {
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

  const [image, setImage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    setUser((values) => ({ ...values, [name]: value }));
  };

  const fetchProfile = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/user.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        setUser(res.data[0]);
        console.log(res.data, 'success');
        setImage(res.data[0].profile_picture);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .put(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/register.php`, {
        ...user,
        profile_picture: image,
        user_id: localStorage.getItem('motor_socmed'),
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          window.location.reload();
        }
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());
      }
    };
  };

  return (
    <div>
      <Header />

      <div className="w-full h-screen flex justify-center items-center flex-col text-center">
        <div className="w-[30%] flex flex-col justify-center items-center p-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full"
          >
            <div className="w-full flex justify-center my-2">
              <img
                className="w-[10rem] rounded-full object-cover h-[10rem]"
                src={image.length > 0 ? image : Default}
                alt="image"
              />
            </div>

            <Label className="text-start ml-2 text-sm">Profile Picture:</Label>
            <Input
              required
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              name="post_image"
              className="my-2 w-full"
            />
            <Input
              defaultValue={user.name}
              placeholder="Name"
              name="name"
              className="mb-2"
              onChange={handleChange}
            />
            <Input
              defaultValue={user.email}
              placeholder="Email"
              name="email"
              className="mb-2"
              onChange={handleChange}
            />
            <Input
              defaultValue={user.password}
              type="password"
              placeholder="Password"
              className="mb-2"
            />
            <Input
              defaultValue={user.password}
              type="password"
              placeholder="Re-enter password"
              name="password"
              className="mb-2"
              onChange={handleChange}
            />

            <Label className="text-start ml-2 text-sm">Birthday:</Label>
            <Input
              defaultValue={user.birthday}
              type="date"
              className="mb-2"
              name="birthday"
              onChange={handleChange}
            />

            <div className="flex justify-start mb-4">
              <div className="flex">
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  className="w-[2rem] h-[1.2rem] cursor-pointer"
                  checked={user.gender === 'male' ? true : false}
                  onChange={handleChange}
                />
                <Label className="text-start mr-2 text-sm">Male</Label>
              </div>
              <div className="flex">
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={user.gender === 'female' ? true : false}
                  className="w-[2rem] h-[1.2rem] cursor-pointer"
                  onChange={handleChange}
                />
                <Label className="text-start mr-2 text-sm">Female</Label>
              </div>
            </div>

            <Input
              defaultValue={user.address}
              placeholder="Address"
              name="address"
              className="mb-2"
              onChange={handleChange}
            />

            <Button className="w-[80%] self-center mt-[3rem]" type="submit">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
