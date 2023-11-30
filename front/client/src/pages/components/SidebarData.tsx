import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { socket_user } from "../../socket";
import { datas } from "../Data/Data";

interface SidebarDataProps {
  toggle: boolean;
}
const SidebarData: React.FC<SidebarDataProps> = ({ toggle }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname);
  
  const handleLogout = (path: string) => {
    if (path === "/login") {
      if (socket_user) {
        socket_user.emit("userOffline");
      }
      axios.get("http://localhost:3000/profile/deletecookie", {
        withCredentials: true,
      });
   
    } else {
      setActiveSection(path);
    }
  };
  return (
    <div className="">
      {datas.map((data) => {
        return (
          <div
            className={`${
              toggle ? "" : ""
            }  last:absolute left-5  bottom-4 group`}
            key={data.id}
          >
            <Link
              to={data.path}
              onClick={() => handleLogout(data.path)}
              className={`${
                data.path === activeSection &&
                "bg-gradient-to-br from-[#f78562] to-[#ce502a] text-white"
              } "lg:mr-8 text-lg lg:text-[1.7rem] sidebar text-[#7B7987] hover:text-white "`}
            >
              {data.icon}
            </Link>
            <span className=" block sidebar-tooltip group-hover:scale-100">
              {data.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default SidebarData;
