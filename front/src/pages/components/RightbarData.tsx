import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { socket_user } from "../../socket";

export function handelProfile(data: any) {
  return data;
}

interface RightbarDataProps {
  toggle: boolean;
}
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About:string;
  status_user: string;
  wins:number;
  losses:number;
  gamesPlayed:number;
};
const RightbarData: React.FC<RightbarDataProps> = ({ toggle }) => {

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true });
        await axios.get("http://localhost:3000/auth/get-user", { withCredentials: true });

        const friends = friendsResponse.data;

        setUsers(friends);
        if (socket_user) {
          socket_user.on("RefreshFriends", async () => {
            const newfriends = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true }); 
            setUsers(newfriends.data); 
          });
          socket_user.on("offline", (data: any) => {
            setUsers(prevUsers => {
              return prevUsers.map((user: User) => {
                if (user.id_user === data.id_user) {
                  return { ...user, status_user: "offline" };
                }
                return user;
              });
            });
          });
          socket_user.on("online", (data: any) => {
            setUsers(prevUsers => {
              return prevUsers.map((user: User) => {
                if (user.id_user === data.id_user) {
                  return { ...user, status_user: "online" };
                }
                return user;
              });
            });
          });
        }
      } catch (error) {
              }
    };

    fetchData();

    return () => {
    };
  }, []);
  
  return (
    <div
      className=""
      
    >
      {" "}
      {users.map((data) => (
        <div
          className={`${
            toggle ? "last:w-[3.6rem]" : "last:w-[17rem] pt-2.5"
          } rightbar left-4`}
          key={data.id_user}

        >
          <div className="relative group">
            <img className="w-12 h-12 rounded-full pt-0" src={data.avatar} alt="" />
            {
              data.status_user === "online" ? (
                <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-green-400 border-2 border-[#2D2945] dark:border-gray-800 rounded-full"></span>
              ) : (
                <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-red-400 border-2 border-[#2D2945] dark:border-gray-800 rounded-full"></span>
              )
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightbarData;
