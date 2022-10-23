import Particles from "react-tsparticles";
import { initEngine, starsOptions } from "./particles/StarsParticles";

const Authentication = () => {
  return (
    <div className='bg-black h-screen'>
      <Particles
        options={starsOptions}
        id='tsparticles'
        init={initEngine}
        className='h-full absolute w-full pointer-events-none'
      />
    </div>
  );
};

export default Authentication;
