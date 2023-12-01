import { Popover, Transition } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Card,
  CardBody,
  Chip,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { Modal } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { socket_user, socketuser } from "../../socket";
import { TABLE_HEAD, TABLE_ROWS } from "../Data/FriendListData";
import { fadeIn } from "./variants";

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
};

function FriendList() {
  const [users, setUsers] = useState<
    {
      id: number;
      img: string;
      name: string;
      email: string;
      job: string;
      org: string;
      online: boolean;
      date: string;
    }[]
  >([]);
  const [friend, setFriend] = useState<User[]>([]);
  const [filteredUser, setFilteredUser] = useState<
    {
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
    }[]
  >([]);
  const navigate = useNavigate();
  useEffect(() => {
    setUsers(TABLE_ROWS);
    return () => {};
  }, []);

  useEffect(() => {
    if (socket_user == undefined) {
      socketuser();
    }
    if (users.length > 0) {
    }
  }, [users]);
  useEffect(() => {
    setFilteredUser(friend);
  }, [users]);

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filter = friend.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
    setFilteredUser(filter);
  };

  function removeFriend(id_user: number) {
    axios.post(
      "http://localhost:3000/auth/remove-friends",
      { id_user },
      { withCredentials: true }
    );

    if (socket_user) {
      socket_user.emit("friends-list", id_user);
      socket_user.emit("newfriend", id_user);
    }
    const updatedUsers = friend.filter((user) => user.id_user !== id_user);
    setFriend(updatedUsers);
  }

  const handleBlockUser = (id_user: number) => {
    axios.post(
      "http://localhost:3000/auth/Block-friends",
      { id_user },
      { withCredentials: true }
    );
    Modal.confirm({
      title: "Are you sure, you want to block this friend?",
      okText: "Yes",
      okType: "danger",
      className: " flex justify-center items-center h-100vh",
      onOk: () => {
        if (socket_user) {
          socket_user.emit("friends-list", id_user);
          socket_user.emit("newfriend", id_user);
        }
        const updatedUsers = friend.filter((user) => user.id_user !== id_user);
        setFriend(updatedUsers);
      },
    });
  };

  const [NotFriends, setNotFriends] = useState<User[]>([]);
  const fetchData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/auth/friends", {
        withCredentials: true,
      });
      const dataUser = await axios.get(
        "http://localhost:3000/profile/NotFriends",
        { withCredentials: true }
      );
      setNotFriends(dataUser.data);
      setFriend(data);
    } catch (err) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (socket_user) {
    socket_user.on("list-friends", async () => {
      fetchData();
    });
    socket_user.on("offline", (data: any) => {
      setFriend((prevUsers) => {
        return prevUsers.map((user: User) => {
          if (user.id_user === data.id_user) {
            return { ...user, status_user: "offline" };
          }
          return user;
        });
      });
    });
    socket_user.on("online", (data: any) => {
      setFriend((prevUsers) => {
        return prevUsers.map((user: User) => {
          if (user.id_user === data.id_user) {
            return { ...user, status_user: "online" };
          }
          return user;
        });
      });
    });
  }

  function AddMember(id_user: number) {
    if (socket_user) socket_user.emit("add-friend", { id_user });
    const updatedUsers = friend.filter((user) => user.id_user !== id_user);
    setFriend(updatedUsers);
  }
  return (
    <motion.div className=" flex w-full h-[90%] text-white bg-transparent mx-10">
      <Card className=" flex items-center h-[90%] w-full mx-10  bg-transparent  mt-10">
        <div className=" flex items-center justify-between gap-8 bg-transparent">
          <div className="flex items-center justify-between p-4 space-x-[39rem] mb-5">
            <div className="mx-10 ">
              <Typography
                className="font-PalanquinDark text-2xl text-white"
                variant="h5"
                color="blue-gray"
              >
                Members list
              </Typography>
              <Typography
                color="gray"
                className="mt-1 font-normal text-sm  text-gray-400 mb-5 w-56 -mr-20"
              >
                See information about all members
              </Typography>
            </div>
            <div>
              <div className="max-w-md mx-auto">
                <div className="relative flex items-center w-full h-12 rounded-[15px] focus-within:shadow-lg bg-white overflow-hidden">
                  <div className="grid place-items-center h-full w-24 text-gray-300">
                    <AiOutlineSearch />
                  </div>

                  <input
                    className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                    type="text"
                    id="search"
                    placeholder="Search for Friend..."
                    onInput={handelChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row mr-10">
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-3 p-2 rounded-xl bg-slate-500 sm:bg-indigo-500">
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add
                  member
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
                  <Popover.Panel className="absolute right-0 z-10  w-80 -ml-40 text-white">
                    <div className=" flex flex-col  rounded-[30px] mt-3 bg-[#35324db2] hover:scale-100 ">
                      {NotFriends.map((data) => {
                        return (
                          <ul
                            key={data?.id_user}
                            role="list"
                            className="p-6 divide-y divide-slate-200"
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
                                  {data?.email}
                                </div>
                              </div>
                              <button
                                className="ml-auto  bg-indigo-400 hover:bg-indigo-500 text-white font-bold  px-7 rounded-[20px]"
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
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row ml-5">
          <div className="w-full md:w-72"></div>
        </div>
        <CardBody className=" flex overflow-scroll resultUserContainer px-0 justify-center items-center w-[90%] bg-transparent">
          <table className="w-[90%] min-w-max table-auto text-left flex flex-col justify-center ">
            <thead className=" flex justify-center items-center">
              <tr className=" flex ml-[32%] mr-[32%] items-center justify-between space-x-24 fixed">
                {TABLE_HEAD.map((head) => (
                  <th key={head} className=" bg-blue-gray-50/50 p-4  ">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="leading-none opacity-70 font-bold text-xl text-white"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="flex flex-col mt-20 w-full mx-auto justify-evenly items-center ">
              {filteredUser.length > 0
                ? filteredUser.map((data, index: number) => {
                    const isLast = index === TABLE_ROWS.length - 1;
                    const classes = isLast ? "p-4 w-12 h-12" : "p-4 w-12 h-12";
                    const animationDelay = index * 0.5;

                    const handleProfileClick = (friend: any) => {
                      navigate(`/profileFriend/${friend.id_user}`);
                    };
                    return (
                      <motion.tr
                        key={data.id_user}
                        variants={fadeIn("right", 0.2)}
                        initial="hidden"
                        whileInView={"show"}
                        viewport={{ once: false, amount: 0.7 }}
                        transition={{ duration: 2.3, delay: animationDelay }}
                        className="flex bg-black/30 space-x-32 rounded-[27px] w-[70rem] my-2 p-4 ml-32 justify-evenly items-center"
                      >
                        <td className={`${classes} flex`}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="flex items-center w-12 h-12 rounded-full"
                              src={data.avatar}
                              alt={data.name}
                              size="sm"
                              onClick={() => handleProfileClick(data.id_user)}
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal text-white w-40 cursor-pointer"
                                onClick={() => handleProfileClick(data.id_user)}
                              >
                                {data.name}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={`${classes} flex`}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-10 text-gray-500"
                            >
                              {data.games_played}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal ml-14 text-gray-500"
                          >
                            {data.wins}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={data.status_user}
                              className={`${
                                data.status_user === "online"
                                  ? " text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          </div>
                        </td>
                        <td className={`${classes} flex items-center`}>
                          <Tooltip content="Block User">
                            <BiBlock
                              className="h-8 w-8 text-red-400 -ml-14 cursor-pointer"
                              onClick={() => handleBlockUser(data.id_user)}
                            />
                          </Tooltip>
                        </td>
                        <td className={`${classes} flex items-center`}>
                          <div
                            onClick={() => removeFriend(data.id_user)}
                            className=" text-red-400 font-bold -ml-20 cursor-pointer"
                          >
                            remove
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                : friend.map(
                    (
                      {
                        id_user,
                        name,
                        avatar,
                        status_user,
                        wins,
                        games_played,
                      }: {
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
                      },
                      index: number
                    ) => {
                      const isLast = index === TABLE_ROWS.length - 1;
                      const classes = isLast
                        ? "p-4 w-12 h-12"
                        : "p-4 w-12 h-12";
                      const animationDelay = index * 0.5;

                      const handleProfileClick = (friend: any) => {
                        navigate(`/profileFriend/${friend.id_user}`);
                      };
                      return (
                        <motion.tr
                          key={id_user}
                          variants={fadeIn("right", 0.2)}
                          initial="hidden"
                          whileInView={"show"}
                          viewport={{ once: false, amount: 0.7 }}
                          transition={{ duration: 2.3, delay: animationDelay }}
                          className="flex bg-black/30 space-x-32 rounded-[27px] w-[70rem] my-2 p-4 ml-32 justify-evenly items-center"
                        >
                          <td className={`${classes} flex`}>
                            <div className="flex items-center gap-3">
                              <Avatar
                                className="flex items-center w-12 h-12 rounded-full"
                                src={avatar}
                                alt={name}
                                size="sm"
                                onClick={() => handleProfileClick({ id_user })}
                              />
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal text-white w-40 cursor-pointer"
                                  onClick={() =>
                                    handleProfileClick({ id_user })
                                  }
                                >
                                  {name}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={`${classes} flex`}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal ml-10 text-gray-500"
                              >
                                {games_played}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-14 text-gray-500"
                            >
                              {wins}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={status_user}
                                className={`${
                                  status_user === "offline"
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                              />
                            </div>
                          </td>
                          <td className={`${classes} flex items-center`}>
                            <Tooltip content="Block User">
                              <BiBlock
                                className="h-8 w-8 text-red-400 -ml-14 cursor-pointer"
                                onClick={() => handleBlockUser(id_user)}
                              />
                            </Tooltip>
                          </td>
                          <td className={`${classes} flex items-center`}>
                            <div
                              onClick={() => removeFriend(id_user)}
                              className=" text-red-400 font-bold -ml-20 cursor-pointer"
                            >
                              remove
                            </div>
                          </td>
                        </motion.tr>
                      );
                    }
                  )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default FriendList;
