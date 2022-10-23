import EditorPreview from "assets/EditorPreview.jsx";
import ContactForm from "components/home/ContactForm";
import Footer from "components/home/Footer";
import IdeInfo from "components/home/IdeInfo";
import Navbar from "components/home/Navbar";
import { useReducer, useRef } from "react";
import Particles from "react-tsparticles";
import homeInfo from "./lang/homeInfo";
import { initEngine, starsOptions } from "./particles/StarsParticles";
import styles from "./styles/Home.module.scss";

const Home = () => {
  const contactRef = useRef(null);

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" }); // scroll to contact me components reference
  };

  const forceRerender = useReducer(() => ({}))[1]; // to rerender components on the page when a language change

  const lang = localStorage.getItem("lang-preference") || "english"; // get current language preference or select english as default
  const langComp = homeInfo[lang]; // store translated informations

  const handleLanguageSwitch = (e) => {
    localStorage.setItem("lang-preference", e.target.value); // set current preference in local storage
    forceRerender();
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topContainer}>
        <Navbar contact={scrollToContact} fn={handleLanguageSwitch} />
        {/* To seperate nav bar and body content */}
        <div className='mt-20 pointer-events-none opacity-0'></div>
        <div className={styles.heroSection}>
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
            <button className={styles.getStartedBtn}>{langComp.start}</button>
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
      <div className={styles.bottomContent}>
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
      <footer className={styles.footerContainer}>
        <Footer contact={scrollToContact} />
      </footer>
    </main>
  );
};

export default Home;
