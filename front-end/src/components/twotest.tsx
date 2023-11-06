// import { type } from "os";
// import React, { FC, useState, useMemo, useRef, useEffect } from "react";
// // import { RE_DIGIT } from "../constants"
// import OtpInput from "react-otp-input";
// import { constants } from "buffer";
// import { CgSpinner } from "react-icons/cg";
// import axios from "axios";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// interface Props {}
// type User = {
//   id_user: number;
//   name: string;
//   avatar: string;
//   TwoFactor: boolean;
//   secretKey: string | null;
//   status_user: string;
// };
// const TwoFactor = (user: any) => {
//   const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
//   const [loding, setLoding] = useState<boolean>(false);
//   const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
//   const [inputValue, setInputValue] = useState<string>("");
//   const inputRef = useRef<HTMLInputElement>(null);
//   // const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null));
//   const handleOnChange = (
//     { target }: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ): void => {
//     const { value } = target;
//     const newOTP: string[] = [...otp];

//     newOTP[index] = value.substring(value.length - 1);
//     if (!value) setActiveOTPIndex(index - 1);
//     else setActiveOTPIndex(index + 1);
//     setOtp(newOTP);
//     let newInputValue = "";
//     newOTP.forEach((digit) => {
//       newInputValue += digit;
//     });

//     setInputValue(newInputValue);
//     // console.log("newInputValue :");
//     // console.log(newInputValue);
//     // setInputValue(value);
//   };
//   useEffect(() => {
//     inputRef.current?.focus();
//   }, [activeOTPIndex]);
//   const [twoFactor, setTwoFactor] = useState<User[]>([]);
//   function onVerify(user: User) {
//     const backendURL = "http://localhost:3000/auth/verify-qrcode";
//     const backURL = "http://localhost:3000/auth/TwoFactorAuth";
//     const data = { inputValue };
//     const updatedTwoFactorStatus = !user.TwoFactor;
//     const twoFactor = { id_user: user.id_user, enable: updatedTwoFactorStatus };

//     console.log("inputValue : ");
//     console.log(inputValue);
//     console.log("updatedTwoFactorStatus : ");
//     console.log(updatedTwoFactorStatus);
//     axios
//       .post(backendURL, data, { withCredentials: true })
//       .then((response) => {
//         if (response.data == true) {
//           console.log("redirect to login page");
//           setTwoFactor((prevUsers) =>
//             prevUsers.map((u) =>
//               u.id_user === user.id_user
//                 ? { ...u, TwoFactor: updatedTwoFactorStatus }
//                 : u
//             )
//           );
//           axios.post(backURL, twoFactor, {
//             withCredentials: true,
//           });
//         } else {
//           // message error with html code
//           console.log("error");
//           setTwoFactor((prevUsers) =>
//             prevUsers.map((u) =>
//               u.id_user === user.id_user
//                 ? { ...u, TwoFactor: !updatedTwoFactorStatus }
//                 : u
//             )
//           );
//           alert("otp is not correct");
//         }
//         setLoding(false);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setLoding(false);
//       });
//     // setLoding(true);
//     // setTimeout(()=>{
//     //   setLoding(false);
//     // }, 2000)
//   }
//   const [qrCodeDataURL, setQRCodeDataURL] = useState("");
//   // const lotp = axios.get("http://localhost:3000/auth/get-qrcode")
//   // const url = lotp.then((res)=>res.data);

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data } = await axios.get(
//         "http://localhost:3000/auth/get-qrcode",
//         { withCredentials: true }
//       );
//       // const { data } = await axios.get("http://localhost:3000/auth/friends");
//       // console.log("data");
//       // console.log(data);
//       setQRCodeDataURL(data);
//     };
//     fetchData();
//     // fetch('https://fakestoreapi.com/users')
//     //   .then((res) => res.json())
//     //   .then((data) => setUsers(data))
//   }, []);
//   // console.log(lotp.then((res)=>console.log(res.data)));
//   const [open, setOpen] = React.useState(false);
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
//   const toggleTwoFactor = async (user: User) => {
//     const updatedTwoFactorStatus = !user.TwoFactor;

//     setOpen(true);
//     setTwoFactor((prevUsers) =>
//       prevUsers.map((u) =>
//         u.id_user === user.id_user
//           ? { ...u, TwoFactor: updatedTwoFactorStatus }
//           : u
//       )
//     );
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };
//   return (
//     <>
//       {twoFactor.map((user) => (
//         <div key={user.id_user}>
//           {user.TwoFactor ? (
//             <button
//               className="text-lg bg-[#a73232] rounded-2xl p-3 select-none"
//               onClick={() => toggleTwoFactor(user)}
//             >
//               Disable Two-Factor(2FA)
//             </button>
//           ) : (
//             <button
//               className="text-lg bg-[#7ca732] rounded-2xl p-3 select-none"
//               onClick={() => toggleTwoFactor(user)}
//             >
//               Enable Two-Factor(2FA)
//             </button>
//           )}
//           <Dialog
//             fullScreen={fullScreen}
//             open={open}
//             onClose={handleClose}
//             maxWidth="xl"
//             aria-labelledby="responsive-dialog-title"
//             sx={{
//               p: 5,
//               "& .MuiPaper-root": {
//                 borderRadius: "26px",
//               },
//             }}
//             PaperProps={{
//               style: {
//                 //backgroundColor transparent
//                 backgroundColor: "transparent",

//                 borderRadius: "28px",
//                 // padding: "32px 135px",
//               },
//             }}
//             className="duration-500 backdrop-blur-lg  group-hover:blur-sm hover:!blur-none group-hover:scale-[0.85] hover:!scale-100 cursor-pointer p-8 group-hover:mix-blend-luminosity hover:!mix-blend-normal shadow-2xl"
//           >
//             <div className="bg-[#8b98e452] h-[65vh]">
//               <DialogContent>
//                 <DialogContentText className=" flex flex-col justify-center items-center ">
//                   <div className="relative justify-center flex flex-col m-12 space-y-8 w-200 h-auto pt-5  rounded-[40px] md:flex-row md:space-y-0 ">
//                     <div className="relative flex flex-col justify-center p-8 items-center md:p-14">
//                       <img
//                         src={qrCodeDataURL}
//                         alt="QRcode"
//                         className=" mb-5 rounded-2xl bg-red-400"
//                       />
//                       <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">
//                         Enter your OTP{" "}
//                       </div>
//                       <div className="flex flex-row justify-center p-3 md:pl-14 md:pr-14">
//                         {otp.map((_, index) => {
//                           return (
//                             <React.Fragment key={index}>
//                               <input
//                                 ref={index === activeOTPIndex ? inputRef : null}
//                                 type="number"
//                                 className="remove-arrow bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1 text-[#3b3760] font-bold text-center font-zcool"
//                                 onChange={(e) => handleOnChange(e, index)}
//                                 value={otp[index]}
//                               />
//                             </React.Fragment>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => onVerify(user)}
//                     className=" w-1/2  flex gap-1 items-center justify-center py-2.5 font-bold text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] my-3 rounded-full shadow-2xl"
//                   >
//                     {loding && (
//                       <CgSpinner className=" animate-spin" size={20} />
//                     )}
//                     {/* <CgSpinner className=' animate-spin' size={20} /> */}
//                     <span>Verify OTP</span>
//                   </button>
//                 </DialogContentText>
//               </DialogContent>
//             </div>
//           </Dialog>
//         </div>
//       ))}
//     </>
//   );
// };
// export default TwoFactor




import { type } from "os";
import React, { FC, useState, useMemo, useRef, useEffect } from "react";
// import { RE_DIGIT } from "../constants"
import OtpInput from 'react-otp-input';
import { constants } from "buffer";
import { CgSpinner } from "react-icons/cg"
import axios from "axios";


// type Props ={
//   value: string;
//   valueLength: number;
//   onChange: (value: string) => void;
// }

// function Otpinput({value, valueLength, onChange}: Props)
// {
//   const valueItems = useMemo(() =>{
//     const valueArray = value.split('');
//     const items: Array<string> = [];
//     for(let i = 0; i< valueLength; i++){
//       const char = valueArray[i];
//       // const re = new RegExp(/^d+$/);

//       if(RE_DIGIT.test(char)){
//         items.push(char);
//       }else{
//         items.push('');
//       }
//     }
//     return items;
//   }, [value, valueLength]);

//   const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx:number)=>{
//     const target = e.target;
//     let targetValue = target.value;
//     const isTargetValueDigit = RE_DIGIT.test(targetValue);


//     if(!isTargetValueDigit && targetValue !== '')
//     {
//       return;
//     }

//     targetValue = isTargetValueDigit ? targetValue : ' ';

//     const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);
//     onChange(newValue);

//     if(!isTargetValueDigit)
//       return;
//     const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

//     if (nextElementSibling){
//       nextElementSibling.focus();
//     }
//   }

//   return(
//     <div className='relative flex flex-col justify-center p-8 items-center md:p-14'>
//       <div className='flex flex-row justify-center p-3 md:pl-14 md:pr-14'>
//         {valueItems.map((digit, idx) =>(
//           <input 
//             key={idx} 
//             type="text"
//             inputMode="numeric"
//             autoComplete="one-time-code"
//             pattern="\d{1}"
//             maxLength={6}
//             className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'
//             value={digit}
//             onChange={(e) => inputOnChange(e, idx)}
//             />
//         ))}
//         {/* <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-3'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/> */}
//       </div>
//       <button className='font-bold w-1/2 text-white hover:scale-105 duration-300 bg-[#FE754D] p-2 rounded-full mb-3 mt-3'>Verify</button>
//     </div>
//   );
// }
interface Props { }

const Otpinput: FC<Props> = (props): JSX.Element => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loding, setLoding] = useState<boolean>(false);
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null)
  // const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null));
  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const { value } = target;
    const newOTP: string[] = [...otp]

    newOTP[index] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(index - 1);
    else setActiveOTPIndex(index + 1);
    setOtp(newOTP);
    let newInputValue = '';
  newOTP.forEach((digit) => {
    newInputValue += digit;
  });

  setInputValue(newInputValue);
  // console.log("newInputValue :");
  // console.log(newInputValue);
    // setInputValue(value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex])
  
  function onVerify() {
    const backendURL = 'http://localhost:3000/auth/verify-qrcode';
    const data = { inputValue };

    console.log("inputValue : ");
    console.log(inputValue);
    axios
      .post(backendURL, data, { withCredentials: true })
      .then((response) => {
        // console.log('Response from backend:', response.data);
       //redirect to home page
       console.log(response.data);
       console.log("before redirect"); 
        if(response.data == true)
        {
          console.log("redirect to login page"); 
          window.location.href = 'http://localhost:5173/home';
        }else{
          // message error with html code
          console.log("error");
          alert("otp is not correct");

        }      

        setLoding(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoding(false);
      });
    // setLoding(true);
    // setTimeout(()=>{
    //   setLoding(false);
    // }, 2000)
  }
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');
  // const lotp = axios.get("http://localhost:3000/auth/get-qrcode")
  // const url = lotp.then((res)=>res.data);


  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-qrcode", { withCredentials: true });
      // const { data } = await axios.get("http://localhost:3000/auth/friends");
      // console.log("data");
      // console.log(data);
      setQRCodeDataURL(data);
    };
    fetchData();
    // fetch('https://fakestoreapi.com/users')
    //   .then((res) => res.json())
    //   .then((data) => setUsers(data))
  }, []);
  // console.log(lotp.then((res)=>console.log(res.data)));
  return (
    <div className="relative justify-center flex flex-col m-12 space-y-8 w-200 h-auto pt-5 pb-4 bg-[#3b376041] shadow-2xl rounded-[40px] md:flex-row md:space-y-0 ">
      <div className='relative flex flex-col justify-center p-8 items-center md:p-14'>
        <img src={qrCodeDataURL} alt="QRcode" className=" mb-5 rounded-2xl bg-red-400" />
        <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">Enter your OTP </div>
        <div className='flex flex-row justify-center p-3 md:pl-14 md:pr-14'>
          {otp.map((_, index) => {
            return (
              <React.Fragment key={index}>
                <input
                  ref={index === activeOTPIndex ? inputRef : null}
                  type="number"
                  className='remove-arrow bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1 text-[#3b3760] font-bold text-center font-zcool'
                  onChange={(e) => handleOnChange(e, index)}
                  value={otp[index]}
                />
                {

                }
              </React.Fragment>
            )
          })}
        </div>
        <button onClick={onVerify} className=' w-1/2  flex gap-1 items-center justify-center py-2.5 font-bold text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] my-3 rounded-full shadow-2xl'>
          {
            loding && <CgSpinner className=' animate-spin' size={20} />
          }
          {/* <CgSpinner className=' animate-spin' size={20} /> */}
          <span >Verify OTP</span>
        </button>
        {/* i h-16 w-64 bg-gradient-to-br from-yellow-400 to-yellow-600 items-center rounded-full shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out */}
        {/* felx flex-row items-center justify-center gap-1 font-bold w-1/2 text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] p-2 rounded-full mb-3 mt-3 shadow-2xl */}
      </div>
    </div>
    );

}
export default Otpinput;



<div className="mx-auto container grid grid-cols-5">
<header className="col-span-5 p-5 bg-amber-200">
    <h1 className="text-center text-2xl">Header</h1>
</header>

<main className="col-span-5  h-96 p-10 bg-blue-200">
    <h1 className="text-center text-2xl">Main Content</h1>
</main>
</div>










<motion.div
    variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
     className="flex justify-center w-full text-white items-center text-6xl">
      {" "}
      <div>
        <canvas
          ref={myCanvas}
          className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-1088 h-644"
          id="canvas"
        ></canvas>
        <p
          className="relative text-bluish-purple inset-0 text-2xl font-roboto font-light px-4 text-center"
          id="message"
        ></p>
        <button
          className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="online-game"
          onClick={handleMultiplayerGameClick}
        >
          Play Online
        </button>
        <button
          className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="bot-game"
          onClick={handleBotGameClick}
        >
          Play vs Bot
        </button>
        {/* <button
          className="hidden text-white bg-exit-red relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="exit-btn"
        >
          Back Home
        </button> */}
      </div>
    </motion.div>