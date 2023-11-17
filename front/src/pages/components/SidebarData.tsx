// import React from "react";
import { datas } from "../Data/Data";
import { Link, useRoutes, useLocation } from "react-router-dom";
import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { socket_user, socketuser } from "../../socket";
import { cp } from "fs";

interface SidebarDataProps {
  toggle: boolean;
}
const SidebarData: React.FC<SidebarDataProps> = ({ toggle }) => {
  const location = useLocation();
  // console.log(location.pathname);
  const [activeSection, setActiveSection] = useState(location.pathname);
  // const history = useHistory();
  // const logoutUser = useCallback(()=>{
  //   localStorage.removeItem("sidebar");
  // }, [])
  // const handleLogout = () => {
  //   localStorage.removeItem("sidebar")
  //   // Add your logout logic here, e.g., clearing user session or redirecting to the login page.
  //   // You can use a state management library like Redux or React Context for managing user authentication state.
  //   // Example: logout();
  //   // history.push("/login");
  //   // setActiveSection()
  // };
  const handleLogout = (path: string) => {
    if (path === "/login") {
      // useEffect(() => {
      if (socket_user) {
        //   console.log("logout=========>");
        socket_user.emit("userOffline");
      }
      axios.get("http://localhost:3000/profile/deletecookie", {
        withCredentials: true,
      });
      // }, []);
      // try{

      // }catch(err){
      // Perform logout actions, such as modifying status to offline
      // For example:
      // setOffline(); // Your function to modify status to offline
      //change status to offline

      // localStorage.removeItem("sidebar");
      console.log("logoooooooout");
      // history.push("/login"); // Redirect to the login page after logout
    } else {
      console.log("path====>");
      console.log("path", path);
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
              // onClick={() => setActiveSection(data.path)}
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
            {/* <div className={`${toggle ? "opacity-0 delay-200" : ""} text-[1rem] text-white whitespace-pre`}>{data.text}</div> */}
          </div>
        );
      })}
    </div>
  );
};
// function SidebarData()
// {}
export default SidebarData;
