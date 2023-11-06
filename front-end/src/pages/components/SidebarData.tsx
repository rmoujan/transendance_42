// import React from "react";
import { datas } from "../Data/Data";
import { Link, useRoutes, useLocation} from "react-router-dom";
import React, { useCallback, useState } from "react";

interface SidebarDataProps {
  toggle: boolean;
}
const SidebarData: React.FC<SidebarDataProps> = ({ toggle }) => {
  const location = useLocation();
  // console.log(location.pathname);
  const [activeSection, setActiveSection] = useState(location.pathname);
  const logoutUser = useCallback(()=>{
    localStorage.removeItem("sidebar");
  }, [])
  const handleLogout = () => {
    localStorage.removeItem("sidebar")
    // Add your logout logic here, e.g., clearing user session or redirecting to the login page.
    // You can use a state management library like Redux or React Context for managing user authentication state.
    // Example: logout();
    // history.push("/login");
    // setActiveSection()
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
              onClick={() => setActiveSection(data.path)}
              className={`${data.path === activeSection && 'bg-gradient-to-br from-[#f78562] to-[#ce502a] text-white'} "lg:mr-8 text-lg lg:text-[1.7rem] sidebar text-[#7B7987] hover:text-white "`}
            >
              {data.icon}
            </Link>
                <span className=" block sidebar-tooltip group-hover:scale-100">{data.text}</span>
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
