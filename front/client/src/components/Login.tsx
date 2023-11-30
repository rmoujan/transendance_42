import axios from "axios";
import { motion } from "framer-motion";
import logo42 from "../img/42logo.png";
import { fadeIn } from "../pages/components/variants";
import TextRevealTW from "./text";

const handleclick = async () => {
  try {
  await axios.get("http://localhost:3000/auth/login/42");
  window.location.href = "/login";
}catch (err) {
}
};

function Login() {
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
            <a href="http://localhost:3000/auth/login/42" onClick={handleclick}>
              <button className="font-bold hover:scale-105 duration-300 mobile:w-60 tablet:w-80  bg-gradient-to-br from-[#FE754D] to-[#ce502a]  text-white p-2 rounded-full mb-6">
                <img src={logo42} alt="42" className="w-6 h-6 inline mr-2" />
                <span>Log In with Intra</span>
              </button>
            </a>
            <div className="text-center text-white text-xs">
              <p className="font-bold  text-[#7F7B86] hover:text-white -mt-2">
                Login with your 42 account to play the game !
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default Login;
