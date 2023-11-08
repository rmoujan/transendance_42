"use client";
import React, { useState, Fragment , useEffect} from "react";
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
import {socket} from "../../socket";
import { set } from "react-hook-form";

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
  const accepteFriend = (friend: any) => {
    // Update selectedFriend with the clicked friend's information
    console.log(friend);
    axios.post("http://localhost:3000/auth/add-friends", {

      id_user: friend.id_user,
    }, {
      withCredentials: true,
    })  
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
    // console.log(friend);
    // navigate(`/profileFriend/${friend.id}`);
  }
  const [user, setUser] = useState<User[]>([]);
  // const [Notification, setNotification] = useState<any[]>();
  const [Notification, setNotification] = useState<Array<any>>([]);
  useEffect(() => {

    if (socket){
     //get notification
     const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/profile/Notifications", {
        withCredentials: true,
      })
      console.log("event notification111111")
      console.log(data);
      setNotification(data);
    }
    fetchData();
      socket.on('notification', (data) => {
        // console.log(data.obj);
        // setNotification(data.obj);
      });
    }
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-user", {
        withCredentials: true,
      })
      const { data: data2 } = await axios.get("http://localhost:3000/profile/Notifications", {
        withCredentials: true,
      })
      console.log("event notification 2222")
      // console.log(data2);
      setNotification(data2);
      console.log("event notification 2222")
      console.log(data);
      if (data == false){
        window.location.href = "/login";
        console.log("false");
      }

      setUser(data);
    };
    fetchData();
  }, []);
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
                  <strong className=" flex justify-center text-xl -mt-14 mb-2">Notification</strong>
                  <div className="flex absolute bg-[#35324b] rounded-3xl w-full  shadow-2xl max-h-72 overflow-scroll resultContainer">
                    {/* this is the panel */}
                    <div className=" flex flex-col">
                      {
                      Notification.map((data) => {
                        return (
                          <ul
                            key={data.id_user}
                           role="list" className="p-6 divide-y divide-slate-200">
                            <li className="flex py-4 first:pt-0 last:pb-0">
                              <img className="h-10 w-10 rounded-full" src={data.avatar} alt="" />
                              <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white">{data.name} </p>
                                {/* <p className="text-sm text-slate-500 truncate">{data.email}</p> */}
                                <div className="text-xs text-blue-200 dark:text-blue-200">a few moments ago</div>
                              </div>
                              {/* Accepte button */}
                              <button className="ml-auto bg-[#FE754D] hover:bg-[#ce502a] text-white font-bold  px-4 rounded-[20px]" onClick={() => accepteFriend(data)}>
                                Accept
                              </button>
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
                3
              </div>
            </span>

            <span>
            {user.map((data) => {
              return (
                <div
                  key={data.id_user}
                 className="flex items-center justify-start w-full h-5 bg-[#35324db2] rounded-[45px] p-4 py-8 font-PalanquinDark  text-xl text-white mr-16">
                  {data.name}
                </div>
              );
            })}
            </span>
            <div className="-ml-16 group">
              {
                user.map((data) => {
                  return (
                    <img
                      key={data.id_user}
                      className="w-14 h-14 p-1 rounded-full ring-2 ring-[#FE754D] dark:ring-[#FE754D] "
                      src={data.avatar}
                      alt="Bordered avatar"
                    />
                  );
                })
              }
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
