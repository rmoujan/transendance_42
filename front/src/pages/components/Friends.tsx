import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { socket_user } from "../../socket";
import DefaultCard from "./DefaultCard";
import FriendCard from "./FriendCard";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
  wins: number;
  losses: number;
  games_played: number;
  Progress: number;
  Wins_percent: number;
  Losses_percent: number;
  About: string;
};
type AccountOwnerProps = {
  user: User[];
};
function Friends({ }: AccountOwnerProps) {
  useEffect(() => {
    const fetchData = async () => {
      const {data}  = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true });
      setFriend(data);
    };
    fetchData();
  }
    , []);
  const [friends, setFriend] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const InviteToPlaye = (friend: any) => {
    const id = friend.id_user;
    if (socket_user) socket_user.emit("invite-game", { id_user: id });
    axios.post(
      "http://localhost:3000/profile/gameinfos",
      {
        homies: true,
        invited: false,
        homie_id: friend.id_user,
      },
      {
        withCredentials: true,
      }
    );

    setSelectedFriend(friend);
	axios.post("http://localhost:3000/profile/GameFlag", {flag:2}, {withCredentials:true});
    setTimeout(() => {
		window.location.href = "http://localhost:5173/game";
    }, 1000);
  };

  return (
    <div>
      <Popover className="relative">
        <Popover.Button className="">
          {selectedFriend ? (
            <FriendCard friend={selectedFriend} />
          ) : (
            <DefaultCard />
          )}
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
          <Popover.Panel className="absolute flex justify-end items-end  right-0 w-[24rem]   text-white">
            <div className="overflow-scroll resultContainer max-h-72 flex flex-col w-[40rem]  rounded-[30px] mt-3 bg-[#585D8E] hover:scale-100 ">
              {friends.map((data: any) => {
                return (
                  <ul
                    key={data.id_user}
                    role="list"
                    className="p-6 divide-y divide-slate-200 -mb-5"
                  >
                    <li className="flex py-4 first:pt-0 last:pb-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={data.avatar}
                        alt=""
                      />
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white">
                          {data.name}
                        </p>
                      </div>
                      <button
                        className="ml-3  bg-[#868686] hover:bg-[#616060] text-white font-bold  px-7 rounded-[15px]"
                        onClick={() => InviteToPlaye(data)}
                      >
                        invite to playe
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
  );
}
export default Friends;
