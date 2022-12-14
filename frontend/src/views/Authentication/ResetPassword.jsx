import TextLogo from "components/TextLogo";
import Transitions from "components/Transition";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Particles from "react-tsparticles";
import { notificationToaster } from "utils/notificationToaster";
import { tw } from "utils/TailwindComponent";
import NotFound from "views/NotFound/NotFound";
import { initEngine, starsOptions } from "../particles/StarsParticles";
import styles from "./Authentication.module.scss";
import ForgetController from "./forgetPassword";

const ResetPassword = () => {
  // Edit page title
  useEffect(() => {
    document.title = "Reset Password | CWM";
  }, []);

  // Store reset token validation state
  const [isValid, setIsValid] = useState(true);

  // Grab the reset token from URL param
  const { token } = useParams();

  // Authentication controlleres
  const forgetController = new ForgetController();

  // Validate the reset token
  forgetController
    .validateResetToken(token)
    .then(({ success }) => {
      setIsValid(success);
    })
    .catch(({ success }) => {
      setIsValid(success || false);
    });

  // Reset password function
  const resetPassword = (e) => {
    forgetController
      .handleReset(e, token)
      .then((response) => {
        const { success, message } = response;
        if (success) {
          notificationToaster(message + ". Redirecting to login page...");
          setTimeout(() => {
            window.location.href = "/authenticate"; // redirect to auth page
          }, 2000);
        } else {
          notificationToaster("Something went wrong", true);
        }
      })
      .catch((error) => {
        notificationToaster(error.response?.data?.message || error, true);
      });
  };

  // Form tailwind styled component
  const Form = tw.form`
    flex 
    flex-col 
    items-center 
    justify-center
    gap-6
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

  return isValid ? (
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
          <TextLogo text='Reset Password' width={65} />
        </Link>
        {/* Seperator */}
        {/* Sign in/up form wrapper */}
        <div className={styles.formsWrapper}>
          <div className='relative h-full w-full transition duration-1000 flex items-center justify-center'>
            <Form
              style={{
                backfaceVisibility: "hidden",
                justifyContent: "space-between",
                marginTop: "-100px",
              }}
              onSubmit={resetPassword}>
              <h1 className='text-white text-4xl text-center'>
                Reset Password
              </h1>
              <div className='flex flex-col gap-2 w-full'>
                <p className='text-white'>Enter your new password</p>
                <Input
                  placeholder='New Password'
                  type='password'
                  name='password'
                  required
                />
              </div>
              <div className='w-full text-center flex flex-col gap-5'>
                <Submit type='submit'>Reset</Submit>
              </div>
            </Form>
          </div>
        </div>
        <Toaster position='bottom-center' reverseOrder={false} />
      </div>
    </Transitions>
  ) : (
    <NotFound />
  );
};

export default ResetPassword;
