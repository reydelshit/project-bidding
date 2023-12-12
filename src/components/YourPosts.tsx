import { Button } from './ui/button';
import { Textarea } from '@/components/ui/textarea';
import Default from '@/assets/default.png';
import { Input } from './ui/input';
import { useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Label } from '@radix-ui/react-label';
import { MainContext } from './context/useMainContext';
import Sidebar from './Sidebar';
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';
import { TbBallpen } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuMessagesSquare } from 'react-icons/lu';
import { CiLocationOn } from 'react-icons/ci';
import { IoPricetagOutline } from 'react-icons/io5';

type PostsType = {
  post_id: string;
  user_id: string;
  post_context: string;
  post_image: string;
  post_isForSale: string;
  post_location: string;
  post_price: string;
  post_date: string;
  name: string;
  email: string;
};

type CommentsType = {
  comment_id: string;
  user_id: string;
  post_id: string;
  comment_content: string;
  created_at: string;

  name: string;
  profile_picture: string;
  email: string;
};

type LikeType = {
  like_id: string;
  user_id: string;
  post_id: string;
  type: string;
};
function YourPosts() {
  const [showMotorInput, setShowMotorInput] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [post_context, setPost_context] = useState('');
  const [post_image, setPost_image] = useState('');
  const [post_location, setPost_location] = useState('');
  const [post_price, setPost_price] = useState('');

  const [posts, setPosts] = useState<PostsType[]>([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentsType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [postIndex, setPostIndex] = useState(0);

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
  const [postLike, setPostLike] = useState<LikeType[]>([]);

  const {
    showMessage,
    setShowMessage,
    recepientIDNumber,
    setRecepientIDNumber,
  } = useContext(MainContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

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

  const fetchAllPosts = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        console.log(res.data);

        setPosts(res.data);
      });
  };

  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_context,
        post_image,
        post_isForSale: isChecked === true ? 'True' : 'False',
        post_location,
        post_price,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          setShowMotorInput(false);
          window.location.reload();
        }
      });
  };

  const fetchALlComments = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/comment.php`)
      .then((res) => {
        console.log(res.data, 'comments');
        setComments(res.data);
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
    fetchALlComments();
    fetchUpvoteAndDownvote();
  }, []);

  const handleDeletePost = (post_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        data: {
          post_id,
        },
      })
      .then((res) => {
        window.location.reload();

        console.log(res.data);
      });
  };

  const handleShowComments = (index: number, post_id: number) => {
    setShowComments(!showComments);
    console.log(index);
    setPostIndex(index);
    setPostID(post_id);
  };

  const handleShowUpdate = (post_id: number) => {
    setShowUpdateForm(!showUpdateForm);
    setPostID(post_id);

    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        params: {
          post_id: post_id,
        },
      })
      .then((res) => {
        console.log(res.data);

        setPost_context(res.data[0].post_context);
        setPost_image(res.data[0].post_image);
        setIsChecked(res.data[0].post_isForSale === 'True' ? true : false);
        setPost_location(res.data[0].post_location);
        setPost_price(res.data[0].post_price);
      });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .put(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/post.php`, {
        post_id: postID,
        post_context,
        post_image,
        post_isForSale: isChecked === true ? 'True' : 'False',
        post_location,
        post_price,
      })
      .then((res) => {
        console.log(res.data);
        setShowUpdateForm(false);
        fetchAllPosts();
        // window.location.reload();
      });
  };

  const handleComment = (post_id: number, post_user_id: number) => {
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/comment.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_id: post_id,
        comment_content: comment,
        user_name: user.name,
        post_user_id,
      })
      .then((res) => {
        console.log(res.data);
        fetchALlComments();
      });
  };

  const handleShowMessage = (id: number) => {
    setShowMessage(!showMessage);
    setRecepientIDNumber(id);
    // console.log(showMessage);
    console.log(id, 'id');
  };

  const fetchUpvoteAndDownvote = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/like.php`)
      .then((res) => {
        console.log(res.data, 'upvote and downvote');
        setPostLike(res.data);
      });
  };
  const handleUpvote = (post_id: number, post_user_id: number) => {
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/like.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_id: post_id,
        type: 'upvote',
        post_user_id,
        user_name: user.name,
      })
      .then((res) => {
        console.log(res.data);
        fetchUpvoteAndDownvote();
      });
  };

  const handleDownVote = (post_id: number, post_user_id: number) => {
    axios
      .post(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/like.php`, {
        user_id: localStorage.getItem('motor_socmed'),
        post_id: post_id,
        type: 'downvote',
        post_user_id,
        user_name: user.name,
      })
      .then((res) => {
        console.log(res.data);
        fetchUpvoteAndDownvote();
      });
  };

  const handleDeleteComment = (comment_id: string) => {
    axios
      .delete(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/comment.php`, {
        data: {
          comment_id,
        },
      })
      .then((res) => {
        console.log(res.data);
        fetchALlComments();
      });
  };

  return (
    <div className="flex justify-center flex-col items-center relative">
      <div className=" bg-slate-50 w-full">
        <Header />

        <Sidebar
          showMotorInput={showMotorInput}
          setShowMotorInput={setShowMotorInput}
        />
        {showMotorInput && (
          <div className="fixed bg-white w-full z-90 h-full border-2 flex justify-center bg-opacity-90">
            <div className="flex flex-col items-center justify-center gap-2 my-[2rem] w-[45rem] border-2 min-h-[30rem] h-fit mt-[15rem] bg-white p-4 rounded-md">
              <form onSubmit={handlePost}>
                <div className="flex gap-4">
                  <img
                    className="w-[8rem] h-[8rem] object-cover rounded-full"
                    src={image.length > 0 ? image : Default}
                    alt="profile"
                  />

                  <div className="w-full">
                    <Textarea
                      onChange={(e) => setPost_context(e.target.value)}
                      required
                      placeholder="Type your message here."
                    />

                    <Input
                      required
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <div className="flex justify-start gap-2 text-start w-[40%] items-center">
                      <Input
                        onChange={handleChange}
                        className="w-[1rem] cursor-pointer"
                        checked={isChecked}
                        type="checkbox"
                      />
                      <Label>Is for sale?</Label>
                    </div>
                    {isChecked && (
                      <>
                        <Input
                          onChange={(e) => setPost_location(e.target.value)}
                          placeholder="Location"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                        <Input
                          onChange={(e) => setPost_price(e.target.value)}
                          placeholder="Price"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    className="bg-red-500"
                    onClick={() => setShowMotorInput(false)}
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
                    className="w-[30rem] h-[30rem] object-cover rounded-md"
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
                  <img
                    className="w-[8rem] h-[8rem] object-cover rounded-full"
                    src={image.length > 0 ? image : Default}
                    alt="profile"
                  />

                  <div className="w-full">
                    <Textarea
                      defaultValue={post_context}
                      onChange={(e) => setPost_context(e.target.value)}
                      placeholder="Type your message here."
                    />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      name="post_image"
                      className="my-2 w-[30rem]"
                    />

                    <div className="flex justify-start gap-2 text-start w-[40%] items-center">
                      <Input
                        onChange={handleChange}
                        className="w-[1rem] cursor-pointer"
                        checked={isChecked}
                        type="checkbox"
                      />
                      <Label>Is for sale?</Label>
                    </div>
                    {isChecked && (
                      <>
                        <Input
                          defaultValue={post_location}
                          onChange={(e) => setPost_location(e.target.value)}
                          placeholder="Location"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                        <Input
                          defaultValue={post_price}
                          onChange={(e) => setPost_price(e.target.value)}
                          placeholder="Price"
                          className="my-2 w-[30rem]"
                          type="text"
                        />
                      </>
                    )}
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
                    className="w-[30rem] h-[30rem] object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="my-[2rem] flex justify-center flex-col items-center mt-[10rem]">
          <div className="w-[60%] flex flex-col justify-center items-centerflex items-center">
            <div className="w-[80%]">
              <div className="w-full text-start my-[2rem]">
                <h1 className="font-bold text-4xl text-start">YOUR POSTS</h1>
              </div>
              {posts &&
                posts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="flex border-2 p-2 flex-col w-full mb-[5rem] text-start rounded-lg bg-white"
                    >
                      {parseInt(user_id) === parseInt(post.user_id) && (
                        <div className="self-end gap-2 flex my-2">
                          <Button
                            onClick={() =>
                              handleShowUpdate(parseInt(post.post_id))
                            }
                          >
                            <TbBallpen className="w-[1.5rem] h-[1.5rem]" />
                            Update
                          </Button>
                          <Button
                            onClick={() => handleDeletePost(post.post_id)}
                          >
                            <RiDeleteBin5Line className="w-[1.5rem] h-[1.5rem]" />
                            Delete
                          </Button>
                        </div>
                      )}

                      <img
                        src={post!.post_image}
                        alt="no image available"
                        className="w-full h-[30rem] object-cover rounded-lg cursor-pointer"
                      />

                      <div className="flex justify-between items-center w-full mt-1">
                        <div className="p-4 max-w-[35rem] break-words">
                          <h1 className="font-bold text-xl">{post.name}</h1>
                          <p className="cursor-pointer break-words">
                            {post.post_context}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-2 my-2 items-center">
                          <div className="flex flex-col gap-3 w-[5rem]">
                            <h1 className="font-bold text-center border-b-4 border-blue-500 text-2xl rounded-sm">
                              {postLike.filter(
                                (like) =>
                                  like.type.includes('upvote') &&
                                  parseInt(like.post_id) ===
                                    parseInt(post.post_id),
                              ).length -
                                postLike.filter(
                                  (like) =>
                                    like.type.includes('downvote') &&
                                    parseInt(like.post_id) ===
                                      parseInt(post.post_id),
                                ).length}
                            </h1>
                            <div className="flex flex-col justify-center items-center">
                              <IoIosArrowUp
                                onClick={() =>
                                  handleUpvote(
                                    parseInt(post.post_id),
                                    parseInt(post.user_id),
                                  )
                                }
                                className="w-[2rem] h-[2rem] cursor-pointer"
                              />
                              <p className="text-blue-500 font-bold">
                                {
                                  postLike.filter(
                                    (like) =>
                                      like.type.includes('upvote') &&
                                      parseInt(like.post_id) ===
                                        parseInt(post.post_id),
                                  ).length
                                }
                              </p>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                              <IoIosArrowDown
                                onClick={() =>
                                  handleDownVote(
                                    parseInt(post.post_id),
                                    parseInt(post.user_id),
                                  )
                                }
                                className="w-[2rem] h-[2rem] cursor-pointer"
                              />

                              <p className="text-blue-500 font-bold">
                                {
                                  postLike.filter(
                                    (like) =>
                                      like.type.includes('downvote') &&
                                      parseInt(like.post_id) ===
                                        parseInt(post.post_id),
                                  ).length
                                }
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() =>
                              handleShowComments(index, parseInt(post.post_id))
                            }
                          >
                            {showComments
                              ? 'Hide Comments'
                              : `${
                                  comments.filter(
                                    (comment) =>
                                      parseInt(comment.post_id) ===
                                      parseInt(post.post_id),
                                  ).length
                                } Comments`}
                          </Button>
                        </div>

                        {post.post_isForSale === 'True' && (
                          <div className="p-4 flex gap-4 w-[50%] flex-col justify-end items-end">
                            <div className="flex flex-row w-full justify-end">
                              <CiLocationOn className="w-[1.5rem] h-[1.5rem] mr-2" />{' '}
                              <p className="break-words w-[60%]">
                                {post.post_location}
                              </p>
                            </div>
                            <div className="flex flex-row">
                              <IoPricetagOutline className="w-[1.5rem] h-[1.5rem] mr-2" />{' '}
                              <p className="font-bold">{post.post_price}</p>
                            </div>

                            <div>
                              <Button
                                onClick={() =>
                                  handleShowMessage(parseInt(post.user_id))
                                }
                                className={`z-[-100] ${
                                  parseInt(user_id) === parseInt(post.user_id)
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                                } `}
                                // disabled={
                                //   parseInt(user_id) === parseInt(post.user_id)
                                //     ? true
                                //     : false
                                // }
                              >
                                <LuMessagesSquare className="w-[1.5rem] h-[1.5rem] mr-2" />{' '}
                                Send Message
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {showComments && postIndex === index && (
                        <div>
                          <div className="p-4">
                            {comments &&
                              comments
                                .filter(
                                  (comment) =>
                                    parseInt(comment.post_id) === postID,
                                )
                                .map((comment, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="flex gap-2 text-2xl w-full p-2 rounded-md"
                                    >
                                      <img
                                        src={
                                          comment.profile_picture.length > 0
                                            ? comment.profile_picture
                                            : Default
                                        }
                                        alt="profile"
                                        className="w-[2rem] h-[2rem] rounded-full object-cover"
                                      />
                                      <div className="flex gap-2 text-sm items-center">
                                        <h1 className="font-bold">
                                          {comment.name}
                                        </h1>
                                        <p>{comment.comment_content}</p>

                                        {parseInt(comment.user_id) ===
                                          parseInt(user_id) && (
                                          <Button
                                            onClick={() =>
                                              handleDeleteComment(
                                                comment.comment_id,
                                              )
                                            }
                                          >
                                            Delete
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                          </div>

                          <div className="flex flex-col">
                            <Textarea
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Type your comment here."
                            />
                            <Button
                              onClick={() =>
                                handleComment(
                                  parseInt(post.post_id),
                                  parseInt(post.user_id),
                                )
                              }
                              disabled={comment.length === 0 ? true : false}
                              className="my-2 self-end"
                            >
                              Submit comment
                            </Button>
                          </div>
                        </div>
                      )}
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

export default YourPosts;
