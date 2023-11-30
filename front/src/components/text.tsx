export const TextRevealTW = () => {
  const text = "PING PONG GAME";

  return (
    <>
      <h1 className="overflow-hidden text-3xl md:text-5xl lg:text-6xl leading-snug text-center font-normal pb-15 bg-gradient-to-r from-[#FE754D] via-[#5F5E9B] to-[#D6775B] text-transparent bg-clip-text font-zcool">
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
