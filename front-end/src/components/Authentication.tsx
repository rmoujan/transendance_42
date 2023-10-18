import React, { useState } from "react";
import Otpinput from "./Otpinput";
import Login from "./Login";
import Sidebar from "../pages/components/Sidebar";
import TextRevealTW from "./text";
import {motion} from "framer-motion";
import { fadeIn } from "../pages/components/variants";
function Authentication(){
  const [otp, setOtp] = useState('123');
  const onChange = (value: string) => setOtp(value);

    return(
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col ">
        <TextRevealTW />
          <motion.div 
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{once:false, amount:0.7}}
          // className='relative justify-center flex flex-col m-12 space-y-8 w-200 max-h-52 pt-5 pb-4 bg-[#3b376041] shadow-2xl rounded-[40px] md:flex-row md:space-y-0 '
          >
            {/* <Login />    */}
            <Otpinput />
          </motion.div>
        </div>
       </div>
    )
  }

export default Authentication;