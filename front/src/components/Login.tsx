import React, { useState, useEffect } from "react";
import logo42 from "../img/42logo.png";
import { motion } from "framer-motion";
import { fadeIn } from "../pages/components/variants";
import TextRevealTW from "./text";
import axios from "axios";
import { Link } from "react-router-dom";
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};

const handleclick = async ()=>{
  const data = await axios.get('http://localhost:3000/auth/login/42');
  window.location.href = '/login';
}

function Login() {
  // const [twoFactor, setTwoFactor] = useState<User[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await axios.get("http://localhost:3000/auth/get-user", {
  //       withCredentials: true,
  //     });
  //     setTwoFactor(data);
  //   };
  //   fetchData();
  // }, []);
  // function  onVerify() {
  //   if (twoFactor[0].TwoFactor === true) {
  //     console.log("redirect to otp page");
  //     window.location.href = "http://localhost:3001/Authentication";
  //   }else{
  //     console.log("redirect to home page");
  //     window.location.href = "http://localhost:3001/home";
  //   }
  // }
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <TextRevealTW />
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="relative justify-center items-center flex flex-col m-12 space-y-8 mobile:w-72 tablet:w-9/12 laptop:w-10/12 max-h-52 pt-5 pb-4 bg-[#3b376041] shadow-2xl rounded-[40px] md:flex-row md:space-y-0 "
        >
          <div className="relative flex flex-col justify-center p-8 items-center md:p-14 ">
            <div>
              {/* {
                twoFactor.map((user) => (
                  <div key={user.id_user}>
                    {user.TwoFactor ? (
                      <Link to="/Authentication">
                        <button className='font-bold hover:scale-105 duration-300 w-80 bg-gradient-to-br from-[#FE754D] to-[#ce502a] text-white p-2 rounded-full mb-6 md:w-80 '>
                          <img src={logo42} alt="42" className='w-6 h-6 inline mr-2' />
                          Log In with Intra
                        </button>
                      </Link>
                    ) : (
                      // <Link to="">
                      <button className='font-bold hover:scale-105 duration-300 w-80 bg-gradient-to-br from-[#FE754D] to-[#ce502a] text-white p-2 rounded-full mb-6 md:w-80 '>
                        <img src={logo42} alt="42" className='w-6 h-6 inline mr-2' />
                        <a href="http://localhost:3000/auth/login/42" >Log In with Intra</a>
                      </button>
                      // </Link>
                    )}
                  </div>
                ))} */}
            </div>
            {/* {twoFactor[0].TwoFactor ? (
              <Link to="/Authentication"> 
                <button className='font-bold hover:scale-105 duration-300 w-80 bg-gradient-to-br from-[#FE754D] to-[#ce502a] text-white p-2 rounded-full mb-6 md:w-80 '>
                  <img src={logo42} alt="42" className='w-6 h-6 inline mr-2' />
                  Log In with Intra
                </button>
              </Link>
            ) : (
              <button className='font-bold hover:scale-105 duration-300 w-80 bg-gradient-to-br from-[#FE754D] to-[#ce502a] text-white p-2 rounded-full mb-6 md:w-80 '>
                <img src={logo42} alt="42" className='w-6 h-6 inline mr-2' />
                Log In with Intra
              </button>
            )} */}
            <a href="http://localhost:3000/auth/login/42" onClick={handleclick}>
              <button className="font-bold hover:scale-105 duration-300 mobile:w-60 tablet:w-80  bg-gradient-to-br from-[#FE754D] to-[#ce502a]  text-white p-2 rounded-full mb-6">
                <img src={logo42} alt="42" className="w-6 h-6 inline mr-2" />
                <span>Log In with Intra</span>
              </button>
            </a>
            <div className="text-center text-white text-xs">
              <p className="font-bold  text-[#7F7B86] hover:text-white -mt-2">
                Login with your 42 account to play the game !
                {/* {" "}
                Two-Factor Authentication */}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default Login;