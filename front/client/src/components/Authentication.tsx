import { motion } from "framer-motion";
import { fadeIn } from "../pages/components/variants";
import Otpinput from "./Otpinput";
import TextRevealTW from "./text";
function Authentication(){

    return(
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="flex flex-col ">
        <TextRevealTW />
          <motion.div 
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{once:false, amount:0.7}}
          >
            <Otpinput />
          </motion.div>
        </div>
       </div>
    )
  }

export default Authentication;