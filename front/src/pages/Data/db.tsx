import { BiHomeAlt2 } from "react-icons/bi";
import { MdInsights } from "react-icons/md";
import { RiCouponLine } from "react-icons/ri";
import { FiUser, FiLogOut } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { TbFriends } from "react-icons/tb";
import { BsFolder, BsWallet2 } from "react-icons/bs";
import { constants } from "buffer";
import { text } from "stream/consumers";
import Arcane from "../../img/Arcane.png";
import Badge from "../../img/badge.png";
import Girl from "../../img/Girl.png";
import Luffy from "../../img/Luffy.png";
export const db = [
  {
    AccountOwner: {
      id: 1,
      src: Arcane,
      name: "Jinx",
      GamesPlayed: 1959,
      Win: "85%",
      Loss: "25%",
      Achievements: {
        name1: "Ping Pong",
        src: Badge,
        status1: "ACHIEVED",
        status2: "NOT-ACHIEVED",
        name2: "Ping Pong",
        status: "ACHIEVED",
      }
    },
    FriendList: {
      "John Michael": {
        id: 1,
        img: Arcane,
        name: "John Michael",
        email: "john@creative-tim.com",
        job: "500",
        org: "Organization",
        online: true,
        date: "125",
        Status: "ONLINE",
      },
      "Alexa Liras": {
        id: 2,
        img: Girl,
        name: "Alexa Liras",
        email: "alexa@creative-tim.com",
        job: "500",
        org: "Developer",
        online: false,
        date: "125",
        Status: "OFFLINE",
      },
      "Laurent Perrier": {
        id: 3,
        img: Luffy,
        name: "Laurent Perrier",
        email: "laurent@creative-tim.com",
        job: "500",
        org: "Projects",
        online: false,
        date: "125",
        Status: "ONLINE",
      },
    },
    TopStreamer: {
      "Alexa Liras": {
        id: 1,
        name: "Alexa Liras",
        rank: Badge,
      },
      "John Michael": {
        id: 2,
        name: "John Michael",
        rank: "02",
      },
      "Laurent Perrier": {
        id: 3,
        name: "Laurent Perrier",
        rank: "03",
      },
    },
    
  },
];