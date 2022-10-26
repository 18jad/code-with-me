import TextLogo from "components/TextLogo";
import { SignOut } from "phosphor-react";
import styles from "./styles/Profile.module.scss";

const Profile = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Logo + sign out section*/}
      <div className={styles.interactionsSection}>
        <div className={styles.logo}>
          <TextLogo text='Profile' width={55} mainSize='xl' textSize='sm' />
        </div>
        <div className={styles.interactionsButtons}>
          <button className={styles.signOutBtn}>
            <span>
              <SignOut size={20} color='#fff' mirrored={true} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile feed section */}
      <div className={styles.profileFeedSection}></div>

      {/* Search section */}
      <div className={styles.searchSection}></div>
    </div>
  );
};

export default Profile;
