import { Route, Routes, useLocation } from "react-router-dom";
import Authentication from "../components/Authentication";
import Login from "../components/Login";
import NotFoundPage from "./NotFoundPage";
import FriendList from "./components/FriendList";
import GamePage from "./components/GamePage";
import LandingPage from "./components/LandingPage";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import ProfileCardUser from "./components/ProfileCardUser";
import Rightbar from "./components/Rightbar";
import Searchbar from "./components/Searchbar";
import Setting from "./components/Setting";
import Sidebar from "./components/Sidebar";
let pathn: string;

function Home() {
	const location = useLocation();
	pathn = location.pathname;
  const match = location.pathname.match(/\/profileFriend\/(\d+)/);
  const extractedPath = match && match[0];
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
            <Route path="/profileFriend/:friendId" element={<ProfileCardUser />} />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/Authentication" element={<Authentication />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {showSidebar && <Rightbar />}
        </div>
      </div>
    </div>
  );
}
export { pathn };
export default Home;
