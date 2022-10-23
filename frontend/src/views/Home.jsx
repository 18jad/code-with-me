import EditorPreview from "assets/EditorPreview.jsx";
import ContactForm from "components/home/ContactForm";
import Footer from "components/home/Footer";
import IdeInfo from "components/home/IdeInfo";
import Navbar from "components/home/Navbar";
import { useEffect, useReducer, useRef } from "react";
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

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topContainer}>
        {/* Navbar */}
        <Navbar contact={scrollToContact} fn={handleLanguageSwitch} />

        {/* Hidden div to seperate navbar and body content */}
        <div className='mt-20 pointer-events-none opacity-0'></div>

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
            <h1>{langComp.title}</h1>
            <p>
              {langComp.body1}
              <br />
              {langComp.body2}
            </p>
          </div>
          <div className={styles.interactions}>
            <button
              className={styles.getStartedBtn}
              onClick={() => {
                navigate("/auth");
              }}>
              {langComp.start}
            </button>
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
