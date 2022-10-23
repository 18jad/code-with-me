import EditorPreview from "assets/EditorPreview.jsx";
import ContactForm from "components/home/ContactForm";
import Footer from "components/home/Footer";
import IdeInfo from "components/home/IdeInfo";
import Navbar from "components/home/Navbar";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useReducer, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import homeInfo from "./lang/homeInfo";
import { initEngine, starsOptions } from "./particles/StarsParticles";
import styles from "./styles/Home.module.scss";

const Home = () => {
  // To navigate through pages
  const navigate = useNavigate();

  // Reference for contact element
  const contactRef = useRef(null);

  // Edit page title
  useEffect(() => {
    document.title = "Code With Me | CWM";
  }, []);

  // Scroll to contact me components reference
  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // To re-render components on the page when a language change
  const forceRerender = useReducer(() => ({}))[1];

  // Get current language preference or select english as default
  const lang = localStorage.getItem("lang-preference") || "english";

  const langComp = homeInfo[lang]; // Store translated informations

  const handleLanguageSwitch = (e) => {
    localStorage.setItem("lang-preference", e.target.value); // Set current preference in local storage
    forceRerender(); // Re-render components on page
  };

  // framer mothing + intersection observer configuration
  const controls = useAnimation();

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // dont change state every time element is not in view do it only once
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible"); // if text is inside view show it
    }
    if (!inView) {
      controls.start("hidden"); // else hide it until it's in view
    }
  }, [controls, inView, lang]);

  const wordAnimation = {
    // empty just to have a varient
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      // start opacity 0 and position y + .4em and scaled down to 0.5
      opacity: 0,
      y: `0.4em`,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: `0em`,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  /////////////////////////////////////////////////////

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topContainer}>
        {/* Navbar */}
        <Navbar contact={scrollToContact} fn={handleLanguageSwitch} />

        {/* Hidden div to seperate navbar and body content */}
        <div className='mt-20 pointer-events-none opacity-0 '></div>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          {/* Stars background */}
          <Particles
            options={starsOptions}
            id='tsparticles'
            init={initEngine}
            className='h-full absolute mt-60 w-full pointer-events-none'
          />
          <div className={styles.introduction}>
            <h1>
              {langComp.title.split(" ").map((word, index) => {
                return (
                  <motion.div
                    ref={ref}
                    aria-hidden='true'
                    key={index}
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      marginRight: "1.25rem",
                    }}
                    initial='hidden'
                    animate={controls}
                    variants={wordAnimation}
                    transition={{
                      delayChildren: index * 0.25,
                      staggerChildren: 0.05,
                    }}>
                    {word.split("").map((character, index) => (
                      <motion.span
                        aria-hidden='true'
                        key={index}
                        style={{ display: "inline-block" }}
                        variants={characterAnimation}>
                        {character}
                      </motion.span>
                    ))}
                  </motion.div>
                );
              })}
            </h1>
            <p>
              {langComp.body1.split(" ").map((word, index) => {
                return (
                  <motion.div
                    ref={ref}
                    aria-hidden='true'
                    key={index}
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      marginRight: "0.5rem",
                    }}
                    initial='hidden'
                    animate={controls}
                    variants={wordAnimation}
                    transition={{
                      delayChildren: index * 0.05,
                      staggerChildren: 0.05,
                    }}>
                    {word.split("").map((character, index) => (
                      <motion.p
                        aria-hidden='true'
                        key={index}
                        style={{ display: "inline-block" }}
                        variants={characterAnimation}>
                        {character}
                      </motion.p>
                    ))}
                  </motion.div>
                );
              })}
              <br />
              {langComp.body2.split(" ").map((word, index) => {
                return (
                  <motion.div
                    ref={ref}
                    aria-hidden='true'
                    key={index}
                    style={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      marginRight: "0.5rem",
                    }}
                    initial='hidden'
                    animate={controls}
                    variants={wordAnimation}
                    transition={{
                      delayChildren: index * 0.05,
                      staggerChildren: 0.05,
                    }}>
                    {word.split("").map((character, index) => (
                      <motion.p
                        aria-hidden='true'
                        key={index}
                        style={{ display: "inline-block" }}
                        variants={characterAnimation}>
                        {character}
                      </motion.p>
                    ))}
                  </motion.div>
                );
              })}
            </p>
          </div>
          <div className={styles.interactions}>
            <motion.button
              className={styles.getStartedBtn}
              initial={{
                opacity: 0,
                border: "none",
                scale: 0.3,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                borderBottom: "7px solid #2e73f1",
                borderLeft: "1.4px solid #2e73f1",
                borderRight: "1.4px solid #2e73f1",
              }}
              whileHover={{
                borderBottom: "3px solid #315dae",
              }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                navigate("/auth");
              }}>
              {langComp.start}
            </motion.button>
            <div className={styles.mobileDownload}>
              <p>
                {langComp.mobile}
                <br />
                <span className={styles.platformSelection}>
                  <b>Android</b>
                </span>
                {langComp.and}
                <span className={styles.platformSelection}>
                  <b>IOS</b>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className={styles.bottomContent}>
        {/* Stars background */}
        <Particles
          options={starsOptions}
          id='tsparticles2'
          init={initEngine}
          className='h-full absolute mt-60 w-full pointer-events-none'
        />
        <div className={styles.editorPreviewSection}>
          <EditorPreview className='h-full' /> {/* Extracted svg */}
        </div>
        <div className={styles.idePowers}>
          <IdeInfo /> {/* Github + collaboration divs */}
        </div>
        <hr className='mb-10 opacity-0 pointer-events-none' ref={contactRef} />{" "}
        {/* Contact form reference */}
        <div className={styles.contactFormContainer}>
          <ContactForm /> {/* Contact form */}
        </div>
      </div>
      {/* Footer section */}
      <footer className={styles.footerContainer}>
        <Footer contact={scrollToContact} />
      </footer>
    </main>
  );
};

export default Home;
