import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import Default from '../assets/default.png';
import axios from 'axios';
import { useEffect } from 'react';
import { MdEditNote } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import { useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

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

type BiddingTimelineType = {
  bidding_comment: string;
  bidding_price: string;
  created_at: string;
  name: string;
};

export default function ViewPost() {
  const [showBiddingFormInput, setShowBiddingFormInput] = useState(false);
  const [biddingDetails, setBiddingDetails] = useState({
    post_id: '',
    user_id: '',
    post_context: '',
    post_image: '',
    project_name: '',
    starting_price: '',
    project_location: '',
    close_until: '',
    email_phone: '',
    created_at: '',
    name: '',
  } as PostsType);
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

  const [bidding, setBidding] = useState('');
  const [comment, setComment] = useState('');
  const [biddingTimeline, setBiddingTimeline] = useState<BiddingTimelineType[]>(
    [],
  );

  const { id } = useParams();

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

  const fetchPostDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/post.php`, {
        params: {
          post_id: id,
        },
      })
      .then((res: any) => {
        console.log(res.data, 'post details');
        setBiddingDetails(res.data[0]);
      });
  };

  const handleBidding = (currentPrice: string, post_id: number) => {
    axios
      .post(`${import.meta.env.VITE_PROJECT_BIDDING}/bidding.php`, {
        post_id: post_id,
        bidder_id: localStorage.getItem('motor_socmed'),
        bidding_price: bidding,
        bidding_comment: comment,
        bidding_current_price: currentPrice,
      })
      .then((res: any) => {
        console.log(res.data);

        window.location.reload();
      });
  };

  const fetchBiddingTimeline = () => {
    axios
      .get(`${import.meta.env.VITE_PROJECT_BIDDING}/bidding.php`, {
        params: {
          post_id: id,
        },
      })
      .then((res: any) => {
        console.log(res.data, 'biddingTimeline');
        setBiddingTimeline(res.data);
      });
  };

  useEffect(() => {
    fetchUserDetails();
    fetchPostDetails();
    fetchBiddingTimeline();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('motor_socmed');
    window.location.href = '/login';
  };
  return (
    <div className="flex justify-center flex-col items-center relative">
      <div className=" w-full flex justify-center">
        <Header />
        <div className="flex flex-col h-[80%] justify-between mt-[10rem] fixed left-0 p-5 w-[15rem] z-40 bg-white rounded-lg border-2">
          <div>
            <div className="flex items-center my-4">
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

            <Link to={`/`}>
              <h1 className="w-full cursor-pointer hover:text-blue-500 font-bold flex py-3">
                <MdEditNote className="w-[1.5rem] h-[1.5rem] mr-2" /> Post
                Project
              </h1>
            </Link>

            <Link to={`/post/yourpost/${user_id}`}>
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
      </div>

      <div className="flex w-[80%] ml-[15rem] justify-between gap-2">
        <div className="w-[70%] mt-[10rem] ">
          <h1 className="font-bold text-2xl">Project Details</h1>

          <Label className="block mt-[2rem] font-bold">Bidder Name:</Label>
          <h1>{biddingDetails.name}</h1>

          <Label className="block mt-[2rem] font-bold">Project Name:</Label>
          <h1>{biddingDetails.project_name}</h1>

          <Label className="mt-[2rem] block font-bold">Details:</Label>
          <p className="w-[80%] break-words">{biddingDetails.post_context}</p>

          <Label className="mt-[2rem] block font-bold">Project Location:</Label>
          <p>{biddingDetails.project_location}</p>

          <Label className="mt-[2rem] block font-bold">Close Until:</Label>

          <p>{biddingDetails.close_until}</p>

          <span className="w-fit text-white border-2 block p-2 bg-blue-500 rounded-md mt-[2rem]">
            <Label className="block font-bold">Starting Price:</Label>
            <p className="font-bold">{biddingDetails.starting_price} PHP</p>
          </span>
        </div>

        <div className="flex w-[35rem] mt-[10rem] p-2 flex-col">
          <h1 className="bg-blue-500 p-2 rounded-md text-white font-bold text-2xl mb-[2rem]">
            Current Price: PHP{' '}
            {biddingTimeline.reduce(
              (acc, price) => Number(acc) + Number(price.bidding_price),
              Number(biddingDetails.starting_price),
            )}
          </h1>
          <div className="flex flex-col w-full ">
            <h1 className="text-start font-bold my-2">Starts bid now!</h1>
            <Input
              onChange={(e) => setComment(e.target.value)}
              placeholder="comment"
            />

            <div className="flex gap-2 mt-2 w-full">
              <Input
                type="number"
                onChange={(e) => setBidding(e.target.value)}
                placeholder="Your Bid"
              />
              <Button
                disabled={bidding.length > 0 ? false : true}
                onClick={() =>
                  handleBidding(
                    biddingDetails.starting_price,
                    Number(biddingDetails.post_id),
                  )
                }
                className="bg-blue-500 text-white px-5 py-2 rounded-md ml-[1rem]"
              >
                Bid
              </Button>
            </div>

            <div className="mt-[2rem]">
              <h1 className="font-bold mb-[1rem]">
                Bidding Timeline (sorted by price)
              </h1>

              {biddingTimeline
                .sort(
                  (a, b) => Number(b.bidding_price) - Number(a.bidding_price),
                )
                .map((bidding, index) => (
                  <div className="flex w-full items-center gap-2" key={index}>
                    <div className="flex w-full flex-col bg-blue-500 text-white p-2 rounded-md mb-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="font-bold">{bidding.name}</h1>
                          <p>{bidding.bidding_comment}</p>
                        </div>
                        <p className="font-bold">PHP {bidding.bidding_price}</p>
                      </div>
                      <p>{bidding.created_at}</p>
                    </div>

                    <Button>Deal </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
