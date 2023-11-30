import { AiOutlineMessage, AiOutlineSetting } from "react-icons/ai"
import { BiHomeAlt2 } from "react-icons/bi"
import { FiLogOut, FiUser } from "react-icons/fi"
import { IoGameControllerOutline } from "react-icons/io5"
import { TbFriends } from "react-icons/tb"

export const datas = [

    {
        id: 1,
        icon: <BiHomeAlt2/>,
        text: "Dashboard",
        path: "/home",
    },
    {
        id: 2,
        icon: <FiUser/>,
        text: "User Profile",
        path: "/profile",
    },
    {
        id: 3,
        icon: <TbFriends/>,
        text: "Friends",
        path: "/friends",
    },
    {
        id: 4,
        icon: <IoGameControllerOutline/>,
        text: "Game",
        path: "/game",
    },
    {
        id: 5,
        icon: <AiOutlineMessage/>,
        text: "Messages",
        path: "/messages",
    },
    {
        id: 6,
        icon: <AiOutlineSetting/>,
        text: "Setting",
        path: "/setting",
    },
    {
        id: 7,
        icon: <FiLogOut/>,
        text: "Logout",
        path: "/login" || "/",
    },
    
];