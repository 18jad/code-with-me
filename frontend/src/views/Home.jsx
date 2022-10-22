import EditorPreview from "assets/EditorPreview.jsx";
import ContactForm from "components/ContactForm";
import Footer from "components/Footer";
import IdeInfo from "components/IdeInfo";
import Navbar from "components/Navbar";
import Particles from "react-tsparticles";
import { initEngine, starsOptions } from "./particles/StarsParticles";
import styles from "./styles/Home.module.scss";

const Home = () => {
  return (
    <main className={styles.mainContainer}>
      <div className={styles.topContainer}>
        <Navbar />
        <div className={styles.heroSection}>
          <Particles
            options={starsOptions}
            id='tsparticles'
            init={initEngine}
            className='h-full absolute mt-60 w-full pointer-events-none'
          />
          <div className={styles.introduction}>
            <h1>A collaborative online IDE.</h1>
            <p>
              Code online with you friends, increase your productivity and chat
              together. <br />
              Save your projects online and don't worry about them!
            </p>
          </div>
          <div className={styles.interactions}>
            <button className={styles.getStartedBtn}>Get Started</button>
            <div className={styles.mobileDownload}>
              <p>
                Mobile app available for both <br />
                <span className={styles.platformSelection}>
                  <b>Android</b>
                </span>
                and
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
        <div className={styles.contactFormContainer}>
          <ContactForm /> {/* Contact form */}
        </div>
      </div>
      <footer className={styles.footerContainer}>
        <Footer />
      </footer>
    </main>
  );
};

export default Home;
