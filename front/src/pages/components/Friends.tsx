import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import { ChangeEvent, Fragment, KeyboardEvent, useRef, useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store/store";
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
function Friends({ user }: AccountOwnerProps) {
  // const { friends } = useAppSelector(state => state.app);
  // const friends = await axios.get("http://localhost:3000/auth/friends", {
  //   withCredentials: true,
  // });
  useEffect(() => {
    const fetchData = async () => {
      const {data}  = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true });
      setFriend(data);
      console.log('daaaata : ', data);
    };
    fetchData();
  }
    , []);
  const [friends, setFriend] = useState<User[]>([]);
  console.log(friends);
  // const [friends, setFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [accountOwner, setaccountOwner] = useState<boolean>();
  const InviteToPlaye = (friend: any) => {
    console.log("invite to playe");
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
    console.log("accountOwner id");
    console.log("status ");
    console.log(false);
    console.log(true);

    setSelectedFriend(friend);
	axios.post("http://localhost:3000/profile/GameFlag", {flag:2}, {withCredentials:true});
    setTimeout(() => {
		window.location.href = "http://localhost:5173/game";
    }, 1000);
  };

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  function handelQuerychange(event: ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value.toLowerCase();
    setQuery(searchTerm);

    const filteredUsers = users.filter(user =>
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
              {/* //if not friend show this messag*/}
              {/* {!loding && friends.length === 0 && (
                <div className="flex justify-center items-center mt-4">
                  <p className=" text-center text-gray-300 text-2xl opacity-50">
                    You don't have any friends yet !<br/> Add some friends to playe.
                  </p>
                </div>
              )} */}
              {/* //if friend show this messag*/}
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
                      {/* //when click on button invite to playe the color of button change to gray and stay like this until the friend accept the invitation */}
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
