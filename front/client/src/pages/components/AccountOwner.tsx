import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Cover from "../../img/bg33.png";
import { socket_user } from "../../socket";
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
  email: string;
  wins: number;
  losses: number;
  games_played: number;
  Progress: number;
  Wins_percent: number;
  Losses_percent: number;
};
type AccountOwnerProps = {
  user: User[];
};
function AccountOwner({ user }: AccountOwnerProps) {
  const [NotFriends, setNotFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const { data } = await axios.get(
        "http://localhost:3000/profile/NotFriends",
        { withCredentials: true }
      );
      setNotFriends(data);
    } catch (err) {
    }
    };
    fetchData();
  }, []);
  const [friend, setFriend] = useState<User[]>([]);
  function AddMember(id_user: number) {
    try {
    if (socket_user) socket_user.emit("add-friend", { id_user });

    const updatedUsers = friend.filter((user) => user.id_user !== id_user);
    setFriend(updatedUsers);
    } catch (err) {
    }
  }
  return (
    <div className="bg-[#3f3b5b91] min-w-screen lg-laptop:w-[70%]  lg-laptop:mt-16 rounded-3xl mb-11 shadow-2xl">
      {user.map((data) => {
        return (
          <div
            key={data.id_user}
            className="dark:!bg-navy-800 shadow-shadow-500 mb-5 shadow-3xl flex justify-center rounded-primary relative mx-auto  h-full w-full max-w-[90rem] flex-col items-center bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none"
          >
            <div
              className="relative flex h-72 w-full md:w-[35rem] lg-laptop:w-[108%] justify-center items-end rounded-3xl bg-cover -mt-3 shadow-lg"
              title="object-center"
              style={{
                backgroundImage: `url(${Cover})`,
              }}
            >
              <div className="flex h-[115px] w-[115px] items-center -m-11 justify-center rounded-full border-[10px] border-[#353151] bg-slate-400">
                <div className=" flex h-[98px] w-[98px] items-center -m-11 justify-center rounded-full border-[4px] border-white bg-slate-400">
                  <img
                    className="h-full w-full rounded-full "
                    src={data.avatar}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div
              className=" flex  w-full lg-laptop:flex-row  mt-10  justify-between 
             flex-col-reverse "
            >
              <div className=" mt-4 flex flex-col md:!gap-7 justify-center tablet:flex-row ">
                <div className="flex flex-col items-center justify-center ">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                    {data.games_played}
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal w-24 ">
                    Games Played
                  </p>
                </div>
                <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                    {data.Wins_percent} %
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Win</p>
                </div>
                <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                    {data.Losses_percent} %
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Loss</p>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center ">
                <h4 className="text-white mobile:text-2xl tablet:text-4xl font-PalanquinDark flex-row font-bold lg:mt-4 mt-0 lg-laptop:-ml-52">
                  {data.name}
                </h4>
              </div>
              <div className="flex justify-center mt-4 md:mt-4">
                <Popover>
                  <Popover.Button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] font-semibold rounded-2xl px-5 py-3 text-white shadow-2xl hidden lg-laptop:block">
                    Add Friend +
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
                    <Popover.Panel className="absolute right-0 z-10  w-80 ml-[80%] text-white">
                      <div className=" flex flex-col  rounded-[30px] mt-10 bg-[#35324d] hover:scale-100 ">
                        {NotFriends.map((data) => {
                          return (
                            <ul
                              key={data.id_user}
                              role="list"
                              className="p-6 divide-y divide-slate-200"
                            >
                              <li className="flex py-4 first:pt-0 last:pb-0">
                                <img
                                  className="h-11 w-11 rounded-full"
                                  src={data.avatar}
                                  alt=""
                                />
                                <div className="ml-3 overflow-hidden">
                                  <p className="text-lg font-medium text-white">
                                    {data.name}{" "}
                                  </p>
                                  <div className="text-xs text-blue-200 dark:text-blue-200">
                                    {data?.email}
                                  </div>
                                </div>

                                <button
                                  className="ml-auto  bg-indigo-400 hover:bg-indigo-500 text-white font-bold  px-6 rounded-[20px]"
                                  onClick={() => AddMember(data.id_user)}
                                >
                                  Add
                                </button>
                              </li>
                            </ul>
                          );
                        })}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AccountOwner;
