import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import bot from "../../img/bot.png";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch } from "../../redux/store/store";
import { socket, socket_user, socketuser } from "../../socket";
import AccountOwner from "./AccountOwner";
import Achievements from "./Achievements";
import { fadeIn } from "./variants";

import { TbPhotoEdit, TbUserEdit } from "react-icons/tb";
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About: string;
  status_user: string;
  email: string;
  wins: number;
  losses: number;
  games_played: number;
  Progress: number;
  Wins_percent: number;
  Losses_percent: number;
};
type GameHistory = {
  winner: boolean;
  useravatar: string;
  userscore: number;
  enemyscore: number;
  enemyavatar: string;
  username: string;
  enemyname: string;
  enemyId: number;
};
function MaincontentProfile() {
  const [user, setUser] = useState<User[]>([]);
  const [GameHistory, setGameHistory] = useState<GameHistory[]>([]);
  useEffect(() => {
    if (socket_user == undefined) {
      socketuser();
    }
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-user", {
        withCredentials: true,
      });
      if (data == null) {

        window.location.href = "/login";
      }
      const History = await axios.get("http://localhost:3000/profile/History", {
        withCredentials: true,
      });
      setGameHistory(History.data);
      setUser(data);
    };
    fetchData();
  }, []);
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
    }

    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };
  const fetchData = async () => {
    await axios.get("http://localhost:3000/auth/get-user", {
      withCredentials: true,
    });
  };
  useEffect(() => {
    if (socket == undefined) {
      socketuser();
    }
    fetchData();
  }, []);
  const dispatch = useAppDispatch();
  const Save = async () => {
    const backendURLName = "http://localhost:3000/profile/modify-name";
    const backendURLPhoto = "http://localhost:3000/profile/modify-photo";
    const formData = new FormData();
    const dataName = { name };

    formData.append("name", name);
    if (photo) {
      formData.append("photo", photo);
    }
    if (name) {
      try {
        await axios
          .post(backendURLName, dataName, {
            withCredentials: true,
          });
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Name updated successfully",
          })
        );
        setName("");
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Name updated failed",
          })
        );
        setName("");
      }
    }
    if (photo) {
      try {
        await axios.post(backendURLPhoto, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch(
          showSnackbar({
            type: "success",
            message: "Photo updated successfully",
          })
        );
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Photo updated failed",
          })
        );
        console.error("Error:", error);
      }
    }
    fetchData();
  };
  return (
    <main className=" overflow-scroll resultUserContainer flex flex-col w-full  overflow-y-auto mb-14">
     
      <div className="flex w-full mx-auto pr-5 lg:px-6 py-8 ">
        <div className="flex flex-col w-full h-full text-gray-900 text-xl ">
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="flex md:flex-row flex-col w-full justify-center h-full text-gray-900 text-xl "
          >
            <AccountOwner user={user} />
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
                    <div className="bg-light relative flex h-9 w-full  max-w-7xl  rounded-2xl bg-slate-300">
                      {user.map((item) => (
                        <div
                          key={item.id_user}
                          className="bg-[#ce502ad3] absolute top-0 left-0 flex font-PalanquinDark h-full items-center justify-center rounded-2xl text-lg font-semibold text-white" style={{ width: `${item.Progress}%` }}>
                          <p >{item.Progress}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex lg-laptop:flex-row flex-col space-y-2 justify-center lg:space-x-10 lg:space-y-0 mobile:items-center">
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-col p-4 tablet:min-w-[60vh] max-w-[20px] lg-laptop:px-2 bg-[#3f3b5b91] rounded-3xl mobile:h-3/4  lg-laptop:mt-9 lg-laptop:min-w-[40%] lg-laptop:h-full tablet:w-2/5 lg-laptop:w-1/5 laptop:mb-10 shadow-2xl justify-center mobile:items-center"
              >
                <div className="flex justify-center items-center text-white  text-2xl  laptop:text-4xl font-PalanquinDark">
                    Edit Profile
                  </div>
                <div className=" text-white  flex flex-col justify-center px-3 max-w-[400px] bg-black/20 rounded-2xl shadow-2xl mt-8  mx-2 text-2xl text-center p-4 overflow-hidden">
                  <div className="flex flex-row text-white items-center text-center">
                    <TbUserEdit className="text-2xl" />
                    <input
                      className="bg-transparent border-2 border-white rounded-2xl p-2 ml-3 w-40 text-white"
                      type="text"
                      placeholder="Edit Profile Name"
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className=" flex flex-row text-white items-center text-center mt-5">
                    <TbPhotoEdit className="text-2xl" />
                    <div className=" ml-3 text-lg w-72 text-center items-center p-2 border-2 border-white max-w-[200px] overflow-hidden rounded-2xl">
                      <input type="file" onChange={handlePhotoChange} />
                    </div>
                  </div>

                  <button
                        className=" flex justify-center items-center text-white text-lg bg-[#7ca732] hover:bg-[#5c782d] rounded-2xl p-3 px-5 mt-5"
                        onClick={Save}
                      >
                        Save
                      </button>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 tablet:min-w-[60vh] max-w-[20px] lg-laptop:px-2 bg-[#3f3b5b91] rounded-3xl mobile:h-3/4  lg-laptop:mt-9 lg-laptop:min-w-[40%] lg-laptop:h-full tablet:w-2/5 lg-laptop:w-1/5 laptop:mb-10 shadow-2xl justify-center mobile:items-center"
              >
                <div className="flex justify-center items-center text-white  text-2xl  laptop:text-4xl font-PalanquinDark">
                  About Me
                </div>
                <div className=" text-white  flex justify-center px-3 max-w-[400px] bg-black/20 rounded-2xl shadow-2xl mt-8 font-Bad_Script mx-2 text-2xl text-center p-4 overflow-hidden">

                  {
                    user.map((item) => (
                      <p className="whitespace-pre-line"
                        key={item.id_user}
                      >
                        {item.About === null ? "You don't have any About Me yet !" : item.About}
                      </p>
                    ))
                  }
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex flex-col overflow-auto resultContainer h-[25rem] max-h-[25rem] p-4 rounded-3xl tablet:min-w-[60vh] tablet:w-4/5 tablet:mt-10 tablet:mb-10 lg-laptop:w-[17rem] bg-[#3f3b5b91] laptop:mb-20  shadow-2xl mx-2 lg-laptop:min-w-[80%]  md:mx-10 "
              >
                <div className="text-white flex text-center justify-center fontcPalanquinDark text-2xl  tablet:text-4xl mb-5">
                  Game History
                </div>
                <div className="my-1 flex flex-col max-w-[20] ml-8  mx-h-[50rem]  ">
                  {GameHistory.length === 0 && (
                    <div className="flex justify-center items-center mt-4">
                      <p className="mt-20 text-center text-gray-300 text-2xl opacity-50">
                        You don't have any game history yet !
                      </p>
                    </div>
                  )}
                  {GameHistory.map((item, index) => (
                    <div
                      key={index}
                      className=" bg-black/20 rounded-2xl shadow-2xl flex justify-center items-center p-4 w-[30rem] -mr-10 my-3"
                    >
                      {
                        item.winner ? (
                          <span className=" px-3 font-bold text-emerald-400 ml-2 ">Win</span>
                        ) : (
                          <span className=" font-bold text-red-400  px-3  ml-2">Loss</span>
                        )
                      }
                      <span className=" text-white font-bold px-3">{item.username}</span>
                      <img src={item.useravatar} alt="" className="rounded-full w-12 h-12 mr-5 border-2" />
                      <span className=" text-white text-2xl font-bold">{item.userscore}</span>
                      <span className=" text-white font-bold">:</span>
                      <span className=" text-white text-2xl font-bold">{item.enemyscore}</span>

                      {
                        (item.enemyId === 9) ? (
                          <>
                            <img src={bot} alt="" className="rounded-full w-12 h-12 ml-5 -mt-1 border-2" />
                            <span className=" text-white px-3 font-bold">Bot</span>
                          </>
                        ) : (
                          <>
                            <img src={item.enemyavatar} alt="" className="rounded-full w-12 h-12 ml-5 border-2" />
                            <span className=" text-white px-3 font-bold">{item.enemyname}</span>
                          </>
                        )
                      }
                      </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 overflow-scroll resultContainer p-4 bg-[#3f3b5b91] h-[25rem] rounded-3xl tablet:min-w-[60vh]  tablet:w-4/5 lg-laptop:w-1/2 shadow-2xl mx-2 md:mx-10 md:mb-9 laptop:mt-20 lg-laptop:mt-0 lg:mb-0 justify-center items-center lg-laptop:min-w-[80%]"
              >
                <div className=" text-white flex justify-center items-center  text-2xl  tablet:text-4xl font-PalanquinDark">
                  Achievements
                </div>
            <div className="my-1 flex flex-col max-w-[30rem] mx-auto text-white">
                  <Achievements />
                </div>
              </motion.div>
            </div>

          
          </div>
         
        </div>
      </div>

    </main>
  );
}

export default MaincontentProfile;
