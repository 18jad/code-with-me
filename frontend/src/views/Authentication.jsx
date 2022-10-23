import TextLogo from "components/TextLogo";
import Particles from "react-tsparticles";
import { initEngine, starsOptions } from "./particles/StarsParticles";
import styles from "./styles/Authentication.module.scss";

const Authentication = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Stars Background */}
      <Particles
        options={starsOptions}
        id='tsparticles'
        init={initEngine}
        className='h-full absolute w-full pointer-events-none'
      />
      {/* Authentication Logo */}
      <div className={styles.authLogo}>
        <TextLogo text='Authentication' width={65} />
      </div>
    </div>
  );
};

export default Authentication;
