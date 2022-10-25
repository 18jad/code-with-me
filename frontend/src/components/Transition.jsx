import { motion } from "framer-motion";

const pageTransition = {
  initial: {
    // start
    opacity: 0,
  },
  animate: {
    // animate
    opacity: 1,
    transition: { duration: 0.35 },
  },
  exit: {
    // exit page
    opacity: 0,
    transition: { duration: 0.35 },
  },
};

const Transition = ({ children }) => {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageTransition}>
      {children}
    </motion.div>
  );
};
export default Transition;
