"use client";
import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { socket_user } from "../../socket";
import ProfileCard from "./ProfileCard";
import SearchbarData from "./SearchbarData";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};

function Searchbar() {

  const accepteFriend = (friend: any) => {
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
      .then(async () => {
        const notif = await axios.get(
          "http://localhost:3000/profile/Notifications",
          {
            withCredentials: true,
          }
        );
        setNotification(notif.data);

        if (socket_user) {
          socket_user.emit("friends-list", friend.id_user);
          socket_user.emit("newfriend", friend.id_user);
        }
      })
      .catch(() => {
      });
  };

  const [user, setUser] = useState<User[]>([]);
  const [Notification, setNotification] = useState<Array<any>>([]);
  const fetchData = async () => {
    try {
    const { data } = await axios.get("http://localhost:3000/auth/get-user", {
      withCredentials: true,
    });
    if (data == false) {
      window.location.href = "/login";
    }
    const obj = await axios.get("http://localhost:3000/profile/verifyOtp", {
      withCredentials: true,
    })
    if (obj.data.TFA == true && obj.data.verified == false){
      window.location.href = "/Authentication";
    }
    const notif = await axios.get(
      "http://localhost:3000/profile/Notifications",
      {
        withCredentials: true,
      }
    );
    setNotification(notif.data);
    setUser(data);
  } catch (err) {
  }
  };
  const accepteGame = (friend: any) => {
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
	axios.post("http://localhost:3000/profile/GameFlag", {flag:2}, {withCredentials:true});
    setTimeout(() => {
      window.location.href = "http://localhost:5173/game";
    }, 1000);
   fetchData();
  };
  useEffect(() => {
    if (socket_user) {
     socket_user.emit("userOnline");

      socket_user.on("notification", async () => {
        try {
        const { data } = await axios.get(
          "http://localhost:3000/profile/Notifications",
          {
            withCredentials: true,
          }
        );
        setNotification(data);
      } catch (err) {
      }
      });
    }
    fetchData();
  }, []);
  const calculateTimeElapsed = (createdAt: string) => {
    const currentTime = new Date(); 
    const messageTime = new Date(createdAt); 

    const timeDifference = currentTime.getTime() - messageTime.getTime(); 
    const seconds = Math.floor(timeDifference / 1000); 
    const minutes = Math.floor(seconds / 60); 
    const hours = Math.floor(minutes / 60); 
    const days = Math.floor(hours / 24);

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
      <SearchbarData />
      <div className="relative w-fit mt-3 hidden sm:block">
        <Popover className="relative flex justify-center items-center">
          {() => (
            <>

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
                                <div className="text-xs text-blue-200 dark:text-blue-200">
                                  {calculateTimeElapsed(data.createdAt)}
                                </div>
                              </div>
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
                <span className="profile-card group-hover:scale-100 ml-8 mt-5">
                  <ProfileCard />
                </span>
              </div>
            </>
          )}
        </Popover>
      </div>
    </header>
    
  );
}
export default Searchbar;
