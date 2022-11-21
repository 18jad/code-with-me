import AmongUsCyan from "assets/images/amongus_cyan.png";
import AmongUsRed from "assets/images/amongus_red.png";
import { House } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { amongUsOptions, initEngine } from "../particles/AmongUs";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='text-white select-none'>
      <Particles
        options={amongUsOptions}
        id='tsparticles'
        init={initEngine}
        className='h-full absolute w-full top-0 left-0 pointer-events-none'
      />
      <div className='content absolute text-white bg-black left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='notfound flex items-center flex-row justify-center'>
          <img
            src={AmongUsRed}
            alt='amongus'
            className='h-10 mr-4 animate-pulse'
          />
          <span className='text-4xl'>404</span>
          <span className='notfoundtextx border-l-2 border-white ml-4 pl-4 text-4xl'>
            Not found
          </span>
          <img
            src={AmongUsCyan}
            alt='amongus'
            className='h-10 ml-4 animate-pulse'
          />
        </div>
        <button
          className='ml-32 mt-4 py-1 px-4 gap-2 rounded flex items-center'
          onClick={() => {
            navigate("/profile");
          }}>
          <House size={24} className='mb-1' color='#fff' />
          <span>Go back home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
