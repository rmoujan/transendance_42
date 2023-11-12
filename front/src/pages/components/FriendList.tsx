import React, { useEffect, useState, ChangeEvent, Fragment } from "react";
import { BiBlock } from "react-icons/bi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { TABS } from "../Data/FriendListData";
import { TABLE_HEAD } from "../Data/FriendListData";
import { TABLE_ROWS } from "../Data/FriendListData";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { topData } from "../Data/TopStreamerData";
import { Popover, Transition } from "@headlessui/react";
import { useAppSelector } from "../../redux/store/store";
import { Modal } from "antd";
import { socket, socketuser } from "../../socket";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { isBlock } from "typescript";
import { Module } from "module";
import { set } from "react-hook-form";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
  wins:number;
  losses:number;
  games_played:number;
  Progress:number;
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
  const { friends } = useAppSelector((state) => state.app);
  const [friend, setFriend] = useState<User[]>([]);
  const [filteredUser, setFilteredUser] = useState<
    {
      // id: number;
      // img: string;
      // name: string;
      // email: string;
      // job: string;
      // org: string;
      // online: boolean;
      // date: string;
      id_user: number;
      name: string;
      avatar: string;
      TwoFactor: boolean;
      secretKey: string | null;
      status_user: string;
    }[]
  >([]);
  const navigate = useNavigate();
  useEffect(() => {
    setUsers(TABLE_ROWS);
    return () => {};
  }, []);

  useEffect(() => {
    if (socket == undefined) {
      socketuser();
    }
    if (users.length > 0) {
      console.log(users);
    }
  }, [users]);
  useEffect(() => {
    setFilteredUser(friend);
  }, [users]);
  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filter = friend.filter((user) =>
      user.name.toLowerCase().includes(event.target.value)
    );
    setFilteredUser(filter);
  };
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [rmUser, setRmUser] = useState<{ id: number }[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  function removeFriend(id_user: number) {
    axios.post(
      "http://localhost:3000/auth/remove-friends",
      { id_user },
      { withCredentials: true }
    );
    // setFriend(friend.filter((user) => user.id_user !== id_user));
    console.log("id_user", id_user);
    Modal.confirm({
      title: "Are you sure, you want to remove this friend?",
      okText: "Yes",
      okType: "danger",
      className: " flex justify-center items-center h-100vh",
      onOk: () => {
        const updatedUsers = friend.filter((user) => user.id_user !== id_user);
        setFriend(updatedUsers);
      },
    });
  }
  const handleBlockUser = (id_user: number) => {
    console.log("ttttttttttttt");
    axios.post(
      "http://localhost:3000/auth/Block-friends",
      { id_user },
      { withCredentials: true }
    );
    const updatedUsers = friend.filter((user) => user.id_user !== id_user);
    setFriend(updatedUsers);
    setIsBlocked(true);
    // setBlockedUsers([...blockedUsers, id_user]);
  };
  const [NotFriends, setNotFriends] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/friends", {
        withCredentials: true,
      });
      const dataUser = await axios.get(
        "http://localhost:3000/profile/NotFriends",
        { withCredentials: true }
      );
      setNotFriends(dataUser.data);
      console.log("dataNotFriends", dataUser.data);
      console.log("data");
      setFriend(data);
    };
    fetchData();
    // fetch('https://fakestoreapi.com/users')
    //   .then((res) => res.json())
    //   .then((data) => setUsers(data))
  }, []);

  function AddMember(id_user: number) {
    console.log("id_user---------->", id_user);
    if (socket)
      socket.emit("add-friend", { id_user });
    // axios.post("http://localhost:3000/auth/add-friends", { id_user }, { withCredentials: true });
    // setFriend(friend.filter((user) => user.id_user !== id_user));
    Modal.confirm({
      title: "Are you sure, you want to add this friend?",
      okText: "Yes",
      okType: "danger",
      className: " flex justify-center items-center h-100vh",
      onOk: () => {
        const updatedUsers = friend.filter((user) => user.id_user !== id_user);
        setFriend(updatedUsers);
      },
    });
  }
  // const handleProfileClick = (friend: number) => {
  //   // Update selectedFriend with the clicked friend's information
  //   navigate(`/profileFriend/${friend}`);
  // };
  return (
    <motion.div
      // variants={fadeIn("down", 0.2)}
      // initial="hidden"
      // whileInView={"show"}
      // viewport={{ once: false, amount: 0.7 }}
      className=" flex w-full h-[90%] text-white bg-transparent mx-10"
    >
      <Card className=" flex items-center h-[90%] w-full mx-10  bg-transparent  mt-10">
        {/* /*justify-start items-start*/}
        {/* <CardHeader floated={false} shadow={false} className="rounded-none"> */}
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
                  {/* {
                    filteredUser.map(
                      user =>
                      <h3 key={user.id}>
                        {user.name}
                      </h3>
                    )
                  } */}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row mr-10">
              {/* <Button
                className="text-white bg-slate-500 p-2 rounded-xl px-3"
                variant="outlined"
                size="sm"
              >
                view all
              </Button> */}

              {/* <Button
                className="flex items-center gap-3 rounded-xl bg-slate-500 sm:bg-indigo-500"
                size="sm"
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
              </Button>
               */}

              <Popover className="relative">
                <Popover.Button
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-500 sm:bg-indigo-500"
                  // size="sm"
                >
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
                                {/* <p className="text-sm text-slate-500 truncate">{data.email}</p> */}
                                <div className="text-xs text-blue-200 dark:text-blue-200">
                                  a few moments ago
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
          {/* <Tabs value="all" className="w-full md:w-max mx-5">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs> */}
          <div className="w-full md:w-72">
            {/* <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            /> */}
          </div>
        </div>
        {/* </CardHeader> */}
        {/* <div className="flex justify-center m-10 "> */}
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
              {friend.map(
                (
                  {
                    id_user,
                    name,
                    avatar,
                    TwoFactor,
                    secretKey,
                    status_user,
                    wins,
                    losses,
                    games_played,
                    Progress,
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
                  const classes = isLast ? "p-4 w-12 h-12" : "p-4 w-12 h-12";
                  const animationDelay = index * 0.5;

                  const handleProfileClick = (friend: any) => {
                    console.log("friend : ");
                    console.log(friend.id_user);
                    // Update selectedFriend with the clicked friend's information
                    navigate(`/profileFriend/${friend.id_user}`);
                  };
                  return (
                    // <div
                    //   key={id_user}
                    //  className=" flex justify-center">
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
                              onClick={() => handleProfileClick({ id_user })}
                            >
                              {name}
                            </Typography>
                            {/* <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {email}
                                  </Typography> */}
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
                          {/* <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  {org}
                                </Typography> */}
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
                          {/* {status_user} */}
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={status_user}
                            className={`${status_user === "online" ?  " text-green-500" : "text-red-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className={`${classes} flex items-center`}>
                        {isBlocked ? (
                          <div className="text-red-400 font-bold -ml-20">
                            Blocked
                          </div>
                        ) : (
                          <Tooltip content="Block User">
                            {/* <Button variant="text" className="" > */}
                            <BiBlock
                              className="h-8 w-8 text-red-400 -ml-14 cursor-pointer"
                              onClick={() => handleBlockUser(id_user)}
                            />
                            {/* </Button> */}
                          </Tooltip>
                        )}
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
                    // </div>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        {/* </div> */}
        {/* <CardFooter className="flex items-center justify-end mr-5  border-blue-gray-50 p-4 "> */}
        {/* <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography> */}
        {/* <div className="flex gap-2 justify-end">
            <Button
              className="text-white rounded-xl p-2"
              variant="outlined"
              size="sm"
            >
              Previous
            </Button>
            <Button
              className="text-white rounded-xl"
              variant="outlined"
              size="sm"
            >
              Next
            </Button>
          </div> */}
        {/* </CardFooter> */}
      </Card>
    </motion.div>
  );
}

export default FriendList;

// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
// import {
//   Card,
//   CardHeader,
//   Input,
//   Typography,
//   Button,
//   CardBody,
//   Chip,
//   CardFooter,
//   Tabs,
//   TabsHeader,
//   Tab,
//   Avatar,
//   IconButton,
//   Tooltip,
// } from "@material-tailwind/react";

// export function FriendList() {
//   return (
//     <motion.div
//       variants={fadeIn("down", 0.2)}
//       initial="hidden"
//       whileInView={"show"}
//       viewport={{ once: false, amount: 0.7 }}
//       className=" flex w-[100%] h-[90%] rounded-[45px] text-white bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#3f3a5f] shadow-2xl mx-10"
//     >
//       <Card className="h-full w-full">
//         <CardHeader floated={false} shadow={false} className="rounded-none">
//           <div className="mb-8 flex items-center justify-between gap-8">
//             <div className=" mx-10">
//               <Typography
//                 className="font-PalanquinDark text-2xl"
//                 variant="h5"
//                 color="blue-gray"
//               >
//                 Members list
//               </Typography>
//               <Typography
//                 color="gray"
//                 className="mt-1 font-normal  text-sm text-gray-300"
//               >
//                 See information about all members
//               </Typography>
//             </div>
//             <div className="flex shrink-0 flex-col gap-2 sm:flex-row mr-10">
//               <Button
//                 className="text-white p-2 rounded-xl"
//                 variant="outlined"
//                 size="sm"
//               >
//                 view all
//               </Button>
//               <Button className="flex items-center gap-3 rounded-xl bg-slate-500" size="sm">
//                 <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
//               </Button>
//             </div>
//           </div>
//           <div className="flex flex-col items-center justify-between gap-4 md:flex-row ml-5">
//             {/* <Tabs value="all" className="w-full md:w-max">
//               <TabsHeader>
//                 {TABS.map(({ label, value }) => (block
//                   <Tab key={value} value={value}>
//                     &nbsp;&nbsp;{label}&nbsp;&nbsp;
//                   </Tab>
//                 ))}
//               </TabsHeader>
//             </Tabs> */}
//             <div className="w-full md:w-72">
//               {/* <Input
//                 label="Search"
//                 icon={<MagnifyingGlassIcon className="h-5 w-5" />}
//               /> */}
//             </div>
//           </div>
//         </CardHeader>
//         {/* <div className=""> */}
//           <CardBody className="overflow-scroll px-0">
//             <table className="mt-4 w-full min-w-max table-auto text-left">
//               <thead>
//                 <tr>
//                   {TABLE_HEAD.map((head) => (
//                     <th
//                       key={head}
//                       className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
//                     >
//                       <Typography
//                         variant="small"
//                         color="blue-gray"
//                         className="font-normal leading-none opacity-70"
//                       >
//                         {head}
//                       </Typography>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {TABLE_ROWS.map(
//                   ({ img, name, email, job, org, online, date }, index) => {
//                     const isLast = index === TABLE_ROWS.length - 1;
//                     const classes = isLast
//                       ? "p-4"
//                       : "p-4 border-b border-blue-gray-50";

//                     return (
//                       <tr key={name}>
//                         <td className={classes}>
//                           <div className="flex items-center gap-3">
//                             <Avatar
//                               className="w-12 h-12"
//                               src={img}
//                               alt={name}
//                               size="sm"
//                             />
//                             <div className="flex flex-col">
//                               <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className="font-normal"
//                               >
//                                 {name}
//                               </Typography>
//                               <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className="font-normal opacity-70"
//                               >
//                                 {email}
//                               </Typography>
//                             </div>
//                           </div>
//                         </td>
//                         <td className={classes}>
//                           <div className="flex flex-col">
//                             <Typography
//                               variant="small"
//                               color="blue-gray"
//                               className="font-normal"
//                             >
//                               {job}
//                             </Typography>
//                             <Typography
//                               variant="small"
//                               color="blue-gray"
//                               className="font-normal opacity-70"
//                             >
//                               {org}
//                             </Typography>
//                           </div>
//                         </td>
//                         <td className={classes}>
//                           <div className="w-max">
//                             <Chip
//                               variant="ghost"
//                               size="sm"
//                               value={online ? "online" : "offline"}
//                               color={online ? "green" : "blue-gray"}
//                             />
//                           </div>
//                         </td>
//                         <td className={classes}>
//                           <Typography
//                             variant="small"
//                             color="blue-gray"
//                             className="font-normal"
//                           >
//                             {date}
//                           </Typography>
//                         </td>
//                         <td className={classes}>
//                           <Tooltip content="Edit User">
//                             <IconButton variant="text">
//                               <PencilIcon className="h-4 w-4" />
//                             </IconButton>
//                           </Tooltip>
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )}
//               </tbody>
//             </table>
//           </CardBody>
//         {/* </div> */}
//         <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
//           <Typography variant="small" color="blue-gray" className="font-normal">
//             Page 1 of 10
//           </Typography>
//           <div className="flex gap-2">
//             <Button variant="outlined" size="sm">
//               Previous
//             </Button>
//             <Button variant="outlined" size="sm">
//               Next
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }
// export default FriendList;
