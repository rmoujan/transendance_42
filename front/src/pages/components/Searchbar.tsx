"use client";
import React, { useState, Fragment, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { name } from "../Data/Dataname";
import { Popover, Transition } from "@headlessui/react";
import { topData } from "../Data/TopStreamerData";
import SearchbarData from "./SearchbarData";
import { da } from "@faker-js/faker";
import Arcane from "../../img/Arcane.png";
import ProfileCard from "./ProfileCard";
import axios from "axios";
import { socket_user } from "../../socket";
import { set } from "react-hook-form";
import { notification } from "antd";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};

function Searchbar() {
  // const [activeSearch, setActiveSearch] = useState([]);
  // const handleSearch = (e) =>{
  //     if(e)
  // }
  //function accepte friend
  const [AcceptFrienf, setAcceptFrienf] = useState<boolean>();

  const accepteFriend = (friend: any) => {
    // console.log(friend);
    axios
      .post(
        "http://localhost:3000/auth/add-friends",
        {
          id_user: friend.id_user,
        },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        // console.log("add friends fetch result ", res);
        // window.location.reload();
        const notif = await axios.get(
          "http://localhost:3000/profile/Notifications",
          {
            withCredentials: true,
          }
        );
        setNotification(notif.data);

        if (socket_user) {
          // console.log("id_user ", friend.id_user);
          socket_user.emit("friends-list", friend.id_user);
          socket_user.emit("newfriend", friend.id_user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(friend);
    // navigate(`/profileFriend/${friend.id}`);
  };

  const [user, setUser] = useState<User[]>([]);
  const [Notification, setNotification] = useState<Array<any>>([]);
  const fetchData = async () => {
    const { data } = await axios.get("http://localhost:3000/auth/get-user", {
      withCredentials: true,
    });
    if (data == false) {
      console.log("faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalse");
      window.location.href = "/login";
      console.log("false");
    }
    //protection of notificaton
    const notif = await axios.get(
      "http://localhost:3000/profile/Notifications",
      {
        withCredentials: true,
      }
    );
    setNotification(notif.data);
    // console.log("notif");
    // console.log(notif.data);
    // console.log('data : ', data);

    setUser(data);
    // if (socket) {
    //   socket.on("notification", async () => {
    //     // console.log("socket**************");
    //     const { data } = await axios.get(
    //       "http://localhost:3000/profile/Notifications",
    //       {
    //         withCredentials: true,
    //       }
    //       );
    //       setNotification(data);
    //     });
    //     // console.log("socket**********");
    //     // socket.on("notification", async () => {
    //       //   const { data } = await axios.get("http://localhost:3000/profile/Notifications",{
    //         //       withCredentials: true,
    //         //   });
    //         //     setNotification(data);
    //         //     // console.log(data.obj);
    //         //     // setNotification(data.obj);
    //         //   });
    //       }
  };
  const accepteGame = (friend: any) => {
    console.log("accepteGame00000000");
    axios.post(
      "http://localhost:3000/profile/gameinfos",
      {
        homies: true,
        invited: true,
        homie_id: friend.id_user,
      },
      {
        withCredentials: true,
      }
    );
    // const getgame = axios.get("http://localhost:3000/profile/returngameinfos", {
    // 	withCredentials: true,
    // });
    // console.log("getgame");
    // console.log(getgame);
    setTimeout(() => {
      window.location.href = "http://localhost:5173/game";
    }, 1000);
    // console.log(getgame);
    fetchData();
  };
  useEffect(() => {
    if (socket_user) {
      //get notification
      socket_user.emit("userOnline");

      socket_user.on("notification", async () => {
        console.log("event notification");
        const { data } = await axios.get(
          "http://localhost:3000/profile/Notifications",
          {
            withCredentials: true,
          }
        );
        // console.log("event notification111111")
        // console.log(data);
        setNotification(data);
        // fetch();
        // console.log(data.obj);
        // setNotification(data.obj);
      });
      // const fetch = async () => {
      // }
    }
    fetchData();
  }, []);
  const calculateTimeElapsed = (createdAt: string) => {
    const currentTime = new Date(); // Current time
    const messageTime = new Date(createdAt); // Time the message was created

    const timeDifference = currentTime.getTime() - messageTime.getTime(); // Difference in milliseconds
    const seconds = Math.floor(timeDifference / 1000); // Convert milliseconds to seconds
    const minutes = Math.floor(seconds / 60); // Convert seconds to minutes
    const hours = Math.floor(minutes / 60); // Convert minutes to hours
    const days = Math.floor(hours / 24); // Convert hours to days

    if (days > 0 && days == 1) {
      return `${days} day ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0 && hours == 1) {
      return `${hours} hour ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0 && minutes == 1) {
      return `${minutes} minute ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return `a few moments ago`;
    }
  };
  return (
    <header className="flex items-center justify-between p-4 space-x-2 ">
      <h1 className=" text-white text-3xl 2xl:text-4xl lg:ml-32 font-PalanquinDark font-bold">
        Ping Pong{" "}
      </h1>
      {/* <div className="hidden sm:block">
        <input
          type="search"
          name="Serch"
          placeholder="Search for Game..."
          className="w-[25rem] p-2 pl-11 rounded-full bg-[#322f49da] focus:outline-none text-white"
        />
        <button type="submit" className="flex ml-4 -mt-7 text-white "> */}
      <SearchbarData />
      {/* <AiOutlineSearch /> */}

      {/* </button>
      </div> */}
      <div className="relative w-fit mt-3 hidden sm:block">
        <Popover className="relative flex justify-center items-center">
          {({ open }) => (
            <>
              {/* <div className={`${open ? "": ""}absolute mr-32 bottom-auto left-auto right-2 top-1 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-[#C85151] p-1.5 text-xs`}></div> */}
              {/* <div
                className={`absolute mr-32 bottom-auto left-auto right-2 top-1 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full ${open ? "" : "bg-[#C85151]"
                  } p-1.5 text-xs`}
              ></div> */}

              <Popover.Button className="focus:outline-none custom-button">
                <div className="flex w-10 h-10 mr-10 items-center justify-center rounded-full bg-[#322f49da] active:bg-[#3f3c5cda] p-3 text-center text-white shadow-lg dark:text-gray-200">
                  <IoNotifications />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-28 w-80 -ml-72 text-white">
                  <strong className=" flex justify-center text-xl -mt-14 mb-2">
                    Notification
                  </strong>
                  <div className="flex absolute bg-[#35324b] rounded-3xl w-full  shadow-2xl max-h-72 overflow-scroll resultContainer">
                    {/* this is the panel */}
                    {/* if notification is empty */}
                    {Notification.length == 0 && (
                      <div className="flex justify-center items-center w-full h-full">
                        <p className="mt-4 text-lg text-gray-400 ">
                          No Notification yet ! <br />
                        </p>
                      </div>
                    )}
                    <div className=" flex flex-col">
                      {Notification.map((data) => {
                        return (
                          <ul
                            key={data.id_user}
                            role="list"
                            className="p-6 divide-y divide-slate-200 -mb-5"
                          >
                            <li className="flex py-4 first:pt-0 last:pb-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={data?.avatar}
                                alt=""
                              />
                              <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white">
                                  {data?.name}{" "}
                                </p>
                                {/* <p className="text-sm text-slate-500 truncate">{data.email}</p> */}
                                <div className="text-xs text-blue-200 dark:text-blue-200">
                                  {/* a few moments ago */}
                                  {calculateTimeElapsed(data.createdAt)}
                                </div>
                              </div>
                              {/* Accepte button */}
                              {data.AcceptFriend == true ? (
                                <button
                                  className="ml-3 bg-[#FE754D] hover:bg-[#ce502a] text-white font-bold  px-4 rounded-[20px]"
                                  onClick={() => accepteFriend(data)}
                                >
                                  Accept
                                </button>
                              ) : (
                                <button
                                  className="ml-auto bg-[#FE754D] hover:bg-[#ce502a] text-sm text-white font-bold  px-2 rounded-[20px]"
                                  onClick={() => accepteGame(data)}
                                >
                                  Accept game
                                </button>
                              )}
                            </li>
                          </ul>
                        );
                      })}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>

              {/* <div className="flex text-white items-center justify-center mt-8 text-[1.7rem]">
              <TiGroup />
            </div> */}
              {/* </div> */}
              <span className="absolute top-0 right-0 -mt-1 -mr-2">
                <div className="flex items-center justify-center w-5 h-5 bg-[#FE754D] rounded-full text-xs text-white">
                  {Notification.length}
                </div>
              </span>

              <span>
                {user.map((data) => {
                  return (
                    <div
                      key={data.id_user}
                      className="flex items-center justify-start w-full h-5 bg-[#35324db2] rounded-[45px] p-4 py-8 font-PalanquinDark  text-xl text-white mr-16"
                    >
                      {data?.name}
                    </div>
                  );
                })}
              </span>
              <div className="-ml-16 group">
                {user.map((data) => {
                  return (
                    <img
                      key={data.id_user}
                      className="w-14 h-14 p-1 rounded-full ring-2 ring-[#FE754D] dark:ring-[#FE754D] "
                      src={data?.avatar}
                      alt="Bordered avatar"
                    />
                  );
                })}
                {/* // <img
              //   className="w-14 h-14 p-1 rounded-full ring-2 ring-[#FE754D] dark:ring-[#FE754D] "
              //   src={Arcane}
              //   alt="Bordered avatar"
              // /> */}
                <span className="profile-card group-hover:scale-100 ml-8 mt-5">
                  <ProfileCard />
                </span>
              </div>
            </>
          )}
        </Popover>
      </div>
    </header>
    // <form className="left-[807px] top-[20px] absolute text-slate-500 text-[21px] font-medium leading-loose col-span-5 p-10 bg-amber-200">
    //     <div className="relative">
    //         <input type="search" placeholder="Search for Game..." className="w-full p-2 pl-11 rounded-full bg-[#25184288]"/>
    //         <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full">
    //             <AiOutlineSearch />
    //         </button>
    //     </div>
    //     {/* <div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">

    //     </div> */}
    // </form>
  );
}
export default Searchbar;
