import Logo from "./Logo";

const TextLogo = ({ text, width, mainSize = "2xl", textSize = "lg" }) => {
  return (
    <div className='flex flex-row items-center justify-center gap-4 cursor-pointer hover:drop-shadow-wmd duration-200 transition'>
      <Logo width={width || 60} />
      <div className='flex flex-col items-start justify-center'>
        <span className={`text-white font-bold ${`text-${mainSize}`}`}>
          Code With Me
        </span>
        <span className={`text-white font-extralight ${`text-${textSize}`}`}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default TextLogo;
