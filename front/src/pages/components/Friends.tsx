import React, {
  KeyboardEvent,
  ChangeEvent,
  useState,
  Fragment,
  useEffect,
  useRef,
} from "react";
import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { topData } from "../Data/TopStreamerData";
import { useNavigate } from "react-router-dom";
import FriendCard from "./FriendCard";
import DefaultCard from "./DefaultCard";
import { Card } from "antd";
import { useAppSelector } from "../../redux/store/store";
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};
function Friends() {
  const {friends} = useAppSelector((state) => state.app);
  console.log("friends");
  console.log(friends);
  // const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const InviteToPlaye = (friend: User) => {
    // Update selectedFriend with the clicked friend's information
    setSelectedFriend(friend);
    console.log(friend);
    // navigate(`/profileFriend/${friend.id}`);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await axios.get("http://localhost:3000/auth/friends", {
  //       withCredentials: true,
  //     });
  //     console.log("data friends");
  //     console.log(data);
  //     setFriends(data);
  //     // setSelectedFriend(data[0]); // Select the first friend by default
  //   };
  //   fetchData();
  // }, []);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  function handelQuerychange(event: ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value.toLowerCase();
    setQuery(searchTerm);

    const filteredUsers = users.filter((user) =>
      // user.name.firstname.toLowerCase().includes(searchTerm)
      user.name.toLowerCase().includes(searchTerm)
    );

    setSearchResults(filteredUsers);
    console.log(searchResults);
  }
  function handelkeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      if (selectedUserIndex > -1) {
        // navigate(`/profileFriend/${searchResults[selectedUserIndex].id}`);
        // setSelectedUserIndex(-1);
        // setQuery("");
      }
    } else if (event.key === "ArrowUp") {
      if (selectedUserIndex > 0) {
        setSelectedUserIndex(selectedUserIndex - 1);
      }
    } else if (event.key === "ArrowDown") {
      if (selectedUserIndex < searchResults.length - 1) {
        setSelectedUserIndex(selectedUserIndex + 1);
      }
    }
  }
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
              {friends.map((data:any) => {
                return (
                  <ul
                    key={data.id_user}
                    role="list"
                    className="p-6 divide-y divide-slate-200"
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
                        <div className="text-xs text-blue-200 dark:text-blue-200">
                          a few moments ago
                        </div>
                      </div>

                      <button
                        className="ml-auto  bg-[#868686] hover:bg-[#616060] text-white font-bold  px-7 rounded-[15px]"
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
