import TextLogo from "components/TextLogo";
import Particles from "react-tsparticles";
import { tw } from "utils/TailwindComponent";
import { initEngine, starsOptions } from "./particles/StarsParticles";
import styles from "./styles/Authentication.module.scss";

const Authentication = () => {
  const Form = tw.form`
        flex 
        flex-col 
        items-center 
        gap-10
        border
        w-[340px]
        md:w-96
        h-96
        p-8
        bg-white/10
        border-white/30
        backdrop-blur-sm
        rounded-md
    `;

  const Input = tw.input`
    bg-white/10
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-400
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    transition
    duration-150
    text-white
    w-full
`;

  const Submit = tw.button`
    bg-primary/60
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-400
    border-blue-500
    hover:bg-primary
    outline-none
    rounded-sm
    transition
    duration-200
    text-white
    w-full
    `;

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
      <div className='py-10'>
        <TextLogo text='Authentication' width={65} />
      </div>
      <div className='h-32'></div>
      <div className='flex-1'>
        <Form>
          <h1 className='text-white text-4xl'>Sign in</h1>
          <div className='flex flex-col gap-4 w-full'>
            <Input placeholder='Email address' type='email' />
            <div className='w-full flex flex-col items-end'>
              <Input placeholder='Password' type='password' />
              <span className='text-gray text-xs mt-1  hover:text-white duration-200 transition cursor-pointer'>
                Forget password?
              </span>
            </div>
          </div>
          <div className='w-full text-center flex flex-col gap-5'>
            <Submit>Sign in</Submit>
            <p className='text-white font-light text-sm '>
              New here?{" "}
              <span className='font-semibold hover:drop-shadow-wmd cursor-pointer transition duration-150'>
                Sign up
              </span>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Authentication;
