import Navbar from "components/Navbar";
import styles from "./styles/Home.module.scss";

const Home = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.heroSection}>
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
  );
};

export default Home;
