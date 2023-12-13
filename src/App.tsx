import { Button } from './components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from './components/ui/input';
import { useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { Label } from '@radix-ui/react-label';
import Sidebar from './components/Sidebar';

import { RiDeleteBin5Line } from 'react-icons/ri';
import { CiLocationOn } from 'react-icons/ci';
import { TbBallpen } from 'react-icons/tb';

type PostsType = {
  post_id: string;
  user_id: string;
  post_context: string;
  post_image: string;
  project_name: string;
  starting_price: string;
  project_location: string;
  close_until: string;
  email_phone: string;
  created_at: string;
  name: string;
};

function App() {
  const [showBiddingFormInput, setShowBiddingFormInput] = useState(false);

  const [post_context, setPost_context] = useState('');
  const [post_image, setPost_image] = useState('');

  const [posts, setPosts] = useState<PostsType[]>([]);

  const [projectPrice, setProjectPrice] = useState('' as string);
  const [projectName, setProjectName] = useState('' as string);
  // const [projectDescription, setProjectDescription] = useState('' as string);
  const [contactEmailPhone, setContactEmailPhone] = useState('' as string);
  const [location, setLocation] = useState('' as string);
  const [closedUntil, setClosedUntil] = useState('' as string);

  const user_id = localStorage.getItem('motor_socmed') as string;

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [postID, setPostID] = useState(0);
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
        if (res.status === 200) {
          console.log('success');

          setImage(res.data[0].profile_picture);
          setUser(res.data[0]);
          console.log(res.data);
        }
      });
  };

  const fetchAllPosts = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`)
      .then((res) => {
        console.log(res.data);

        setPosts(res.data);
      });
  };

  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_context,
        post_image,
        starting_price: projectPrice,
        project_location: location,
        close_until: closedUntil,
        project_name: projectName,
        email_phone: contactEmailPhone,
      })
      .then((res) => {
        console.log(res.data);
        setShowBiddingFormInput(false);
        window.location.reload();
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setPost_image(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAllPosts();
  }, []);

  const handleDeletePost = (post_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`, {
        data: {
          post_id,
        },
      })
      .then((res) => {
        window.location.reload();

        console.log(res.data);
      });
  };

  const handleShowUpdate = (post_id: number) => {
    setShowUpdateForm(!showUpdateForm);
    setPostID(post_id);

    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`, {
        params: {
          post_id: post_id,
        },
      })
      .then((res) => {
        console.log(res.data);

        setProjectName(res.data[0].project_name);
        setProjectPrice(res.data[0].starting_price);
        setContactEmailPhone(res.data[0].email_phone);
        setLocation(res.data[0].project_location);
        setClosedUntil(res.data[0].close_until);
        setPost_context(res.data[0].post_context);
        setPost_image(res.data[0].post_image);
      });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .put(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`, {
        post_id: postID,
        post_context,
        post_image,
        starting_price: projectPrice,
        project_location: location,
        close_until: closedUntil,
        project_name: projectName,
        email_phone: contactEmailPhone,
      })
      .then((res) => {
        console.log(res.data);
        setShowUpdateForm(false);
        fetchAllPosts();
        window.location.reload();
      });
  };

  return (
    <div className="flex justify-center flex-col items-center relative">
      <div className=" bg-slate-50 w-full">
        <Header />
        <Sidebar
          showBiddingFormInput={showBiddingFormInput}
          setShowBiddingFormInput={setShowBiddingFormInput}
        />

        {showBiddingFormInput && (
          <div className="fixed bg-white w-full z-90 h-full border-2 flex justify-center bg-opacity-90">
            <div className="flex flex-col items-center justify-center gap-2 my-[2rem] w-[45rem] border-2 h-fit mt-[15rem] bg-white p-4 rounded-md">
              <form onSubmit={handlePost}>
                <div className="flex gap-4">
                  <div className="w-full">
                    <h1 className="font-bold">Post Project</h1>
                    <Input
                      required
                      onChange={(e) => setProjectName(e.target.value)}
                      className="my-2"
                      placeholder="Project name"
                    />

                    <Input
                      required
                      onChange={(e) => setProjectPrice(e.target.value)}
                      className="my-2"
                      placeholder="starting price"
                    />
                    <Input
                      required
                      onChange={(e) => setContactEmailPhone(e.target.value)}
                      className="my-2"
                      placeholder="phone or email"
                    />

                    <Input
                      required
                      onChange={(e) => setLocation(e.target.value)}
                      className="my-2"
                      placeholder="Location"
                    />
                    <Textarea
                      onChange={(e) => setPost_context(e.target.value)}
                      required
                      placeholder="Description."
                    />

                    <Input
                      // required
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <Label className="text-sm">Closed until:</Label>
                    <Input
                      type="date"
                      onChange={(e) => setClosedUntil(e.target.value)}
                      className="my-2"
                      placeholder="Closed until"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    className="bg-red-500"
                    onClick={() => setShowBiddingFormInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Post</Button>
                </div>
              </form>

              {post_image.length > 0 && (
                <div className="w-full flex justify-center items-center">
                  <img
                    src={post_image}
                    alt="post"
                    className="w-[5rem] h-[5rem] object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {showUpdateForm && (
          <div className="fixed bg-white w-full z-90 h-full border-2 flex justify-center bg-opacity-90">
            <div className="flex flex-col items-center justify-center gap-2 my-[2rem] w-[45rem] border-2 min-h-[30rem] h-fit mt-[15rem] bg-white p-4 rounded-md">
              <form onSubmit={handleUpdate}>
                <div className="flex gap-4">
                  <div className="w-full">
                    <h1 className="font-bold">Post Project</h1>
                    <Input
                      defaultValue={projectName}
                      required
                      onChange={(e) => setProjectName(e.target.value)}
                      className="my-2"
                      placeholder="Project name"
                    />

                    <Input
                      defaultValue={projectPrice}
                      required
                      onChange={(e) => setProjectPrice(e.target.value)}
                      className="my-2"
                      placeholder="starting price"
                    />
                    <Input
                      defaultValue={contactEmailPhone}
                      required
                      onChange={(e) => setContactEmailPhone(e.target.value)}
                      className="my-2"
                      placeholder="phone or email"
                    />

                    <Input
                      defaultValue={location}
                      required
                      onChange={(e) => setLocation(e.target.value)}
                      className="my-2"
                      placeholder="Location"
                    />
                    <Textarea
                      defaultValue={post_context}
                      onChange={(e) => setPost_context(e.target.value)}
                      required
                      placeholder="Description."
                    />

                    <Input
                      // required
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <Label className="text-sm">Closed until:</Label>
                    <Input
                      defaultValue={closedUntil}
                      type="date"
                      onChange={(e) => setClosedUntil(e.target.value)}
                      className="my-2"
                      placeholder="Closed until"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    className="bg-red-500"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>

              {post_image.length > 0 && (
                <div className="w-full flex justify-center items-center">
                  <img
                    src={post_image}
                    alt="post"
                    className="w-[5rem] h-[5rem] object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="my-[2rem] flex justify-center flex-col items-center text-center mt-[10rem]">
          <div className="w-full flex justify-center">
            <div className="w-[60%] grid grid-cols-3 gap-4 ">
              {posts &&
                posts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="flex border-2 flex-col w-[20rem] text-start rounded-lg bg-white p-4 h-fit"
                    >
                      <div className="flex items-center border-b-2 mb-2 p-2">
                        <div className="flex justify-between items-center w-full">
                          <div className=" w-full break-words">
                            <h1>{post.name}</h1>
                          </div>
                        </div>
                        {parseInt(user_id) === parseInt(post.user_id) && (
                          <div className="flex gap-2">
                            <TbBallpen
                              onClick={() =>
                                handleShowUpdate(parseInt(post.post_id))
                              }
                              className="w-[1.5rem] h-[1.5rem] cursor-pointer"
                            />

                            <RiDeleteBin5Line
                              onClick={() => handleDeletePost(post.post_id)}
                              className="w-[1.5rem] h-[1.5rem] cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {post!.post_image.length > 0 && (
                        <img
                          src={post!.post_image}
                          alt="no image available"
                          className="w-full h-[10rem] object-cover rounded-lg cursor-pointer"
                        />
                      )}

                      <div>
                        <Link to={`/post/${post.post_id}`}>
                          <h1 className="font-bold">{post.project_name}</h1>
                        </Link>

                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <p className="text-xs font-bold">
                              {post.starting_price} PHP
                            </p>
                          </div>
                          <div className="flex items-center">
                            <CiLocationOn className="w-[1.5rem] h-[1.5rem]" />
                            <p className="text-xs">{post.project_location}</p>
                          </div>
                        </div>
                      </div>

                      <Link className="w-full" to={`/post/${post.post_id}`}>
                        <Button className="my-2 w-full">Bid now!</Button>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
