import React from "react";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Searchbar from "./components/Searchbar";
import Maincontent from "./components/Maincontent";
import Footer from "./components/Footter";
import MaincontentProfile from "./components/MaincontentProfile";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import Messages from "./components/Messages";
import Setting from "./components/Setting";
import GamePage from "./components/GamePage";
import Authentication from "../components/Authentication";
import FriendList from "./components/FriendList";
import { useLocation } from "react-router-dom";
import ProfileCardUser from "./components/ProfileCardUser";
import Login from "../components/Login";
import NotFoundPage from "./NotFoundPage";
let pathn: string;

function Home() {
	const location = useLocation();
	pathn = location.pathname;
  const match = location.pathname.match(/\/profileFriend\/(\d+)/);
  // console.log("match");
  const extractedPath = match && match[0];
  // console.log(match);
  const showSidebarPaths = ["/home", "/profile", "/messages", "/friends", "/game", "/setting", extractedPath];
  const showSidebar = showSidebarPaths.includes(location.pathname);
  return (
    <div className="flex h-screen ">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {showSidebar && <Searchbar />}
        <div className="flex h-full ">
          {showSidebar && <Sidebar />}
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/home" element={<LandingPage />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/messages" element={<Messages />}></Route>
            <Route path="/friends" element={<FriendList />}></Route>
            <Route path="/game" element={<GamePage />}></Route>
            <Route path="/setting" element={<Setting />}></Route>
            <Route path="/profileFriend" element={<ProfileCardUser />} />
            {/* <Route path="/profileFriend" element={<ProfileCardUser/>}></Route> */}
            <Route path="/profileFriend/:friendId" element={<ProfileCardUser />} />
            {/* <Route path="/profileFriend/:friendId" element={<ProfileCardUser />} /> */}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/Authentication" element={<Authentication />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {showSidebar && <Rightbar />}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
export {pathn};
export default Home;
