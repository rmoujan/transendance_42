import React, { useState,useEffect } from "react";
import TopStreamer from "./TopStreamer";
import logo from "../../img/logo.png";
import AccountOwner from "./AccountOwner";
import Achievements from "./Achievements";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import bages from "../../img/bdg.png";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import { handelProfile } from "./RightbarData";
import { useParams } from "react-router-dom";
import { online } from "../Data/online";
import Cover from "../../img/bg33.png";
import { MdModeEditOutline } from "react-icons/md";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios";
import { Modal } from "antd";
import { socket } from "../../socket";

let i :number = 1;

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About:string;
  status_user: string;
};

const ProfileCardUser: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const friendIdNumber = friendId ? parseInt(friendId, 10) : undefined;
  const [user, setUser] = useState<User[]>([]);
  const [friend, setFriend] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/friends", {
        withCredentials: true,
      });
      setUser(data);
    };
    fetchData();
  }, []);
  const [isEventEmitted, setIsEventEmitted] = useState(false);
  function AddMember(id_user: number) {
      socket.emit("add-friend", { id_user });
    // axios.post("http://localhost:3000/auth/add-friends", { id_user }, { withCredentials: true });
    // setFriend(friend.filter((user) => user.id_user !== id_user));
    console.log("id_user", id_user);
    Modal.confirm({
      title: 'Are you sure, you want to add this friend?',
      okText: 'Yes',
      okType: "danger",
      className: " flex justify-center items-center h-100vh",
      onOk: () => {
        const updatedUsers = friend.filter((user) => user.id_user !== id_user);
        setFriend(updatedUsers);
      }
    })
  }

  const friendInfo = user.find((friend) => friend.id_user === friendIdNumber);
  console.log("user");
  console.log(friendInfo);
  console.log(friendIdNumber);
  return (
    <main className=" overflow-scroll resultUserContainer flex justify-center items-center flex-col w-[90%]  overflow-y-auto  mb-14">
          <div className="flex text-white text-7xl font-PalanquinDark">Profile {friendInfo?.name}</div>
      <div className="flex  items-center justify-center w-full mx-auto pr-5 lg:px-6 py-8 ">
        <div className="flex flex-col w-2/3 h-full text-gray-900 shadow-2xl bg-[#3f3b5b91] py-16 text-xl rounded-3xl ">
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="flex md:flex-row flex-col w-full justify-center h-full text-gray-900 text-xl "
          >
            {/* <AccountOwner user={friendInfo} /> */}
            <div className="dark:!bg-navy-800 shadow-shadow-500 mb-5 shadow-3xl flex justify-center rounded-primary relative mx-auto  h-full w-full max-w-[90rem] flex-col items-center bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
            <div
              className="relative flex h-60 w-full md:w-[35rem] lg-laptop:w-[86rem] justify-center items-end rounded-3xl bg-cover -mt-3 shadow-lg"
              title="object-center"
              style={{
                // backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bca2fa29-36c0-4b87-aa20-6848ad75c66b/d62n5by-9ef8ff16-8b2d-41c6-849f-093129d3ac3a.jpg/v1/fill/w_1203,h_664,q_70,strp/mercenaries_by_real_sonkes_d62n5by-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODgzIiwicGF0aCI6IlwvZlwvYmNhMmZhMjktMzZjMC00Yjg3LWFhMjAtNjg0OGFkNzVjNjZiXC9kNjJuNWJ5LTllZjhmZjE2LThiMmQtNDFjNi04NDlmLTA5MzEyOWQzYWMzYS5qcGciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.cj4Pf9CSyiVk-cjTsZKAeHUcLPPKP6h-el1mMuLDJmo")',
                backgroundImage: `url(${Cover})`,
              }}
            >
              <div className=" flex h-[98px] w-[98px] items-center -m-11 justify-center rounded-full border-[4px] border-white bg-slate-400">
                <img
                  className="h-full w-full rounded-full "
                  src={friendInfo?.avatar}
                  alt=""
                />
              </div>
            </div>
            {/* <div className="flex mt-16 justify-between items-center w-full">
              <div>first</div>
              <div>second</div>
              <div>therd</div> */}
            <div
              className=" flex  w-full lg-laptop:flex-row  mt-10  justify-between 
             flex-col-reverse "
            >
              <div className=" mt-4 flex flex-col md:!gap-14 justify-center tablet:flex-row ">
                <div className="flex flex-col items-center justify-center ">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                    {155}
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal w-24 ">
                    Games Played
                  </p>
                </div>
                <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">{64} %</h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Win</p>
                </div>
                <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">{45} %</h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Loss</p>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center ">
                <h4 className="text-white mobile:text-2xl tablet:text-4xl flex-row font-bold lg:mt-4 mt-0 lg-laptop:-ml-80">
                {friendInfo?.name}
                </h4>

                {/* <MdModeEditOutline className=" w-6 flex items-center justify-center mx-2 text-gray-400" onClick={()=>toggleUserName(data.id_user, data.name)}/> */}
              </div>
              <div className="flex justify-center mt-4 md:mt-4">
                {/* <button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl px-3 mx-4 shadow-2xl">
                  Edit Profile Photo
                </button> */}
                <button className="w-28 font-semibold rounded-2xl px-3 text-white shadow-2xl hidden lg-laptop:block mr-5" 
                // onClick={()=>AddMember(friendInfo?.id_user)}
                >
                  {/* Add Friend + */}
                </button>
              </div>
            </div>
          </div>


            {/* <div className="bg-[#3f3b5b91] min-w-screen rounded-3xl mb-11 shadow-2xl">
              <div className="dark:!bg-navy-800 shadow-shadow-500 mb-5 shadow-3xl flex justify-center rounded-primary relative mx-auto  h-full w-full max-w-[90rem] flex-col items-center bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
                <div
                  className="relative flex h-60 w-full md:w-[35rem] lg:w-[86rem] justify-center items-end rounded-3xl bg-cover -mt-3 shadow-lg"
                  title="object-center"
                  style={{
                    // backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bca2fa29-36c0-4b87-aa20-6848ad75c66b/d62n5by-9ef8ff16-8b2d-41c6-849f-093129d3ac3a.jpg/v1/fill/w_1203,h_664,q_70,strp/mercenaries_by_real_sonkes_d62n5by-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODgzIiwicGF0aCI6IlwvZlwvYmNhMmZhMjktMzZjMC00Yjg3LWFhMjAtNjg0OGFkNzVjNjZiXC9kNjJuNWJ5LTllZjhmZjE2LThiMmQtNDFjNi04NDlmLTA5MzEyOWQzYWMzYS5qcGciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.cj4Pf9CSyiVk-cjTsZKAeHUcLPPKP6h-el1mMuLDJmo")',
                    backgroundImage: `url(${Cover})`,
                  }}
                >
                  <div className=" flex h-[98px] w-[98px] items-center -m-11 justify-center rounded-full border-[4px] border-white bg-pink-400">
                    <img
                      className="h-full w-full rounded-full "
                      src={friendInfo?.avatar}
                      alt=""
                    />
                  </div>
                </div>
                <div
                  className=" flex flex-col w-full lg:flex-row  mt-10 justify-between space-x-2
             flex-col-reverse px-20"
                >
                  <div className="mt-4 flex md:!gap-14 -mr-48">
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">
                        {friendInfo?.GamesPlayed}
                      </h3>
                      <p className="text-[#A3AED0] text-sm font-normal w-24">
                        Games Played
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">
                        {friendInfo?.Win}
                      </h3>
                      <p className="text-[#A3AED0] text-sm font-normal">Win</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">
                        {friendInfo?.Loss}
                      </h3>
                      <p className="text-[#A3AED0] text-sm font-normal">Loss</p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center pl-60">
                    <h4 className="text-white text-4xl flex-row font-bold lg:mt-4 mt-0">
                      {friendInfo?.name}
                    </h4>

                    <MdModeEditOutline className=" w-6 flex items-center justify-center mx-2 text-gray-400" />
                  </div>
                  <div className="flex justify-center mt-4 md:mt-4">
                    <button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl px-3 mx-4 shadow-2xl">
                      Edit Profile Photo
                    </button>
                    <button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl px-3 shadow-2xl">
                      Add Friend
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </motion.div>
          <div className="flex flex-col items-center  w-full ">
          <motion.div 
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="w-full flex flex-col items-center justify-center mt-2 mb-10 space-y-10 lg:flex-row lg:space-x-8 lg:justify-center">
            <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:w-3/4 lg-laptop:w-3/5">
              <div className=" text-white text-center mt-5 mobile:text-xl tablet:text-3xl font-bold px-11 tablet:px-52">
                Progress
              </div>
              <div className="  w-full px-4  mt-5">
                <div className=" flex justify-center items-center mb-8 w-full">
                  <div className="bg-light relative flex h-7 w-full  max-w-3xl rounded-2xl bg-slate-300">
                    <div className="bg-[#ce502ad3] absolute top-0 left-0 flex h-full w-[90%] items-center justify-center rounded-2xl text-xs font-semibold text-white">
                      90%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:mx-10">
              <p className="text-3xl font-bold text-white mt-5">Badges</p>
              <div className="grid justify-items-end grid-cols-2 md:grid-cols-3 gap-1 space-x-10 m-5 justify-center ">
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex justify-center items-center mb-5" src={bages} alt="" />
              </div>
            </div> */}
          </motion.div>
            <div className="flex lg:flex-row flex-col space-y-2 justify-center lg:space-x-3 lg:space-y-0 mobile:items-center">
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 tablet:min-w-[60vh]  lg-laptop:px-2 bg-[#3f3b5b91] rounded-3xl mobile:h-3/4  lg-laptop:mt-9 lg-laptop:min-w-[30%] lg-laptop:h-full tablet:w-2/5 lg-laptop:w-1/5 laptop:mb-10 shadow-2xl justify-center mobile:items-center"
              >
                {/* <div className="flex-1 justify-center items-center p-4 ml-4 laptop:ml-20"> */}
                <div className="flex justify-center items-center text-white -mt-3 text-2xl  laptop:text-4xl font-PalanquinDark">
                    About Me
                  </div>
                    <p className="whitespace-pre-line text-white  flex justify-center px-3 max-w-[400px] bg-black/20 rounded-2xl shadow-2xl mt-8 font-Bad_Script mx-2 text-2xl text-center p-4 overflow-hidden">
                      {
                        friendInfo?.About
                      }
                    </p>
              </motion.div>
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 rounded-3xl tablet:min-w-[60vh] tablet:w-4/5 tablet:mt-10 tablet:mb-10 lg-laptop:w-1/2 bg-[#3f3b5b91] laptop:mb-20  shadow-2xl mx-2 lg-laptop:min-w-[70%]  md:mx-10 justify-center "
              >
                <div className="text-white flex text-center justify-center font-PalanquinDark text-2xl  tablet:text-4xl mb-5">
                  Game History
                </div>
                <div className="my-1 flex flex-col max-w-[30rem] mx-auto">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className=" bg-black/20 rounded-2xl shadow-2xl flex justify-center p-8  my-3"
                    ></div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 bg-[#3f3b5b91] rounded-3xl tablet:min-w-[60vh]  tablet:w-4/5 lg-laptop:w-1/2 shadow-2xl mx-2 md:mx-10 md:mb-9 laptop:mt-20 lg-laptop:mt-0 lg:mb-0 justify-center items-center lg-laptop:min-w-[70%]"
              >
                  <div className=" text-white flex justify-center items-center  text-2xl  tablet:text-4xl font-PalanquinDark">
                    Achievements
                  </div>
                {/* <div className="flex-1 p-4 ml-4 md:ml-20">
                  <div className="flex w-full max-w-2xl h-72 px-4 md:px-12 rounded-[46px]  mx-auto"> */}
                    {/* <div className="flex flex-col text-white "> */}
                      <div className="my-1 flex flex-col max-w-[30rem] mx-auto text-white">
                        <Achievements />
                      </div>
                    {/* </div> */}
                  {/* </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileCardUser;

// interface ProfileCardUserProps {
//   id: number;
//   name: string;
//   src: string;
// }
// const ProfileCardUser: React.FC<ProfileCardUserProps> = ({ id, name, src }) => {
//   console.log(name);
