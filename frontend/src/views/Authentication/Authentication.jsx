import TextLogo from "components/TextLogo";
import Transitions from "components/Transition";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { setLogin } from "store/slices/loginSlice";
import { tw } from "utils/TailwindComponent";
import authStore from "../lang/authStore";
import { initEngine, starsOptions } from "../particles/StarsParticles";
import styles from "./Authentication.module.scss";
import Login from "./login";
import Register from "./register";

const Authentication = () => {
  // Login and sign up state (for switching between the two)
  const [isLogin, setIsLogin] = useState(true);
  const [forget, setForget] = useState(false);

  // Toaster function
  const notiToaster = (message, error = false) => {
    toast[error ? "error" : "success"](message, {
      style: {
        borderRadius: "8px",
        background: "#fff2",
        border: "1px solid #fff6",
        backdropFilter: "blur(10px)",
        color: "#fff",
      },
    });
  };

  // Authentication controlleres
  const registerController = new Register(notiToaster, setIsLogin);
  const loginController = new Login();

  // Edit page title
  useEffect(() => {
    document.title = "Authentication | CWM";
  }, []);

  // Handle form switching
  const handleFormSwitch = () => {
    setIsLogin(!isLogin);
    setForget(false); // set forget state to false if switching between login and sign up
  };

  // Multi lang
  const lang = localStorage.getItem("lang-preference") || "english";
  const langComp = authStore[lang];

  const dispatch = useDispatch();

  // Form tailwind styled component
  const Form = tw.form`
    flex 
    flex-col 
    items-center 
    justify-center
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
    absolute
    `;

  // Form input tailwind styled component
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

  // Submit button tailwind styled component
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
    <Transitions>
      <div className={styles.pageWrapper}>
        {/* Stars Background */}
        <Particles
          options={starsOptions}
          id='tsparticles'
          init={initEngine}
          className='h-full absolute w-full pointer-events-none'
        />
        {/* Authentication Logo */}
        <Link to='/' className='py-10'>
          <TextLogo text={langComp.authentication} width={65} />
        </Link>
        {/* Seperator */}
        {/* Sign in/up form wrapper */}
        <div className={styles.formsWrapper}>
          <div
            className='relative h-full w-full transition duration-1000 flex items-center justify-center'
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${isLogin ? "0deg" : "180deg"})`,
            }}>
            {/* Sign in form */}
            <Form
              style={{ backfaceVisibility: "hidden", marginTop: "-100px" }}
              onSubmit={(e) => {
                loginController
                  .handleLogin(e)
                  .then(({ user, response }) => {
                    notiToaster(response.data.message);
                    dispatch(setLogin({ user: user, token: user.authToken }));
                  })
                  .catch((error) => {
                    notiToaster(error.response.data.error, true);
                  });
              }}>
              <h1 className='text-white text-4xl'>{langComp.login}</h1>
              <div className='flex flex-col gap-4 w-full'>
                <Input
                  placeholder={langComp.email}
                  type='email'
                  required
                  name='email'
                />
                <div className='w-full flex flex-col items-end'>
                  <Input
                    placeholder={langComp.password}
                    type='password'
                    name='password'
                    required
                  />
                  <span
                    className='text-gray text-xs mt-2  hover:text-white duration-200 transition cursor-pointer'
                    onClick={() => {
                      setForget(true);
                      setIsLogin(!isLogin);
                    }}>
                    {langComp.forget}
                  </span>
                </div>
              </div>
              <div className='w-full text-center flex flex-col gap-5'>
                <Submit type='submit'>{langComp.login}</Submit>
                <p className='text-white font-light text-sm '>
                  {langComp.newHere}{" "}
                  <span
                    className='font-semibold hover:drop-shadow-wmd cursor-pointer transition duration-150'
                    onClick={handleFormSwitch}>
                    {langComp.register}
                  </span>
                </p>
              </div>
            </Form>

            {/* Reset password form */}
            {forget ? (
              <Form
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  justifyContent: "space-between",
                  marginTop: "-100px",
                }}>
                <h1 className='text-white text-4xl text-center'>
                  {langComp.resetPassword}
                </h1>
                <div className='flex flex-col gap-2 w-full'>
                  <Input placeholder={langComp.email} type='email' required />
                  <p className='text-gray text-xs select-none'>
                    {langComp.resetInfo}
                  </p>
                </div>

                <div className='w-full text-center flex flex-col gap-5'>
                  <Submit type='submit'>{langComp.reset}</Submit>
                  <p className='text-white font-light text-sm '>
                    <span
                      className='font-semibold hover:drop-shadow-wmd cursor-pointer transition duration-150'
                      onClick={() => {
                        setIsLogin(true);
                      }}>
                      {langComp.back}
                    </span>
                  </p>
                </div>
              </Form>
            ) : (
              // Sign up form
              <Form
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  height: "480px",
                  marginTop: "-80px",
                }}
                onSubmit={(e) => {
                  registerController.handleRegister(e);
                }}>
                <h1 className='text-white text-4xl'>{langComp.register}</h1>
                <div className='flex flex-col gap-4 w-full'>
                  <Input
                    placeholder={langComp.email}
                    type='email'
                    required
                    name='email'
                  />
                  <div className='double-input flex flex-row gap-2 items-center justify-center'>
                    <Input
                      placeholder={langComp.name}
                      type='text'
                      required
                      name='name'
                    />
                    <Input
                      placeholder={langComp.username}
                      type='text'
                      required
                      name='username'
                    />
                  </div>
                  <Input
                    placeholder={langComp.password}
                    type='password'
                    name='password'
                    required
                  />
                  <Input
                    placeholder={langComp.passwordConfirm}
                    type='password'
                    name='passwordConfirm'
                    required
                  />
                </div>
                <div className='w-full text-center flex flex-col gap-5'>
                  <Submit type='submit'>{langComp.register}</Submit>
                  <p className='text-white font-light text-sm '>
                    {langComp.alreadyMember}{" "}
                    <span
                      className='font-semibold hover:drop-shadow-wmd cursor-pointer transition duration-150'
                      onClick={handleFormSwitch}>
                      {langComp.login}
                    </span>
                  </p>
                </div>
              </Form>
            )}
          </div>
        </div>
        <Toaster position='bottom-center' reverseOrder={false} />
      </div>
    </Transitions>
  );
};

export default Authentication;
