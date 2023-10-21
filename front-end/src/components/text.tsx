import React from "react";

export const TextRevealTW = () => {
    const text = "PING PONG GAME";
  
    return (
      <>
      {/* <h1 className="text-center text-orange-400 text-[20px] font-normal leading-snug pb-20 bg-gradient-to-r from-[#FE754D] via-[#5F5E9B] to-[#D6775B] text-transparent bg-clip-text font-zcool text-6xl	">PING PONG GAME</h1> */}
        <h1 className="overflow-hidden text-3xl md:text-5xl lg:text-6xl lg-laptop:text-8xl leading-snug text-center font-normal pb-15 bg-gradient-to-r from-[#FE754D] via-[#5F5E9B] to-[#D6775B] text-transparent bg-clip-text font-zcool">
          {text.match(/./gu)!.map((char, index) => (
            <span
              className="animate-text-reveal inline-block [animation-fill-mode:backwards]"
              key={`${char}-${index}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </>
    );
  };

export default TextRevealTW;