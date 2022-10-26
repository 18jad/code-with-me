import styles from "./styles/Profile.module.scss";

const Profile = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Logo + sign out section*/}
      <div className={styles.interactionsSection}></div>

      {/* Profile feed section */}
      <div className={styles.profileFeedSection}></div>

      {/* Search section */}
      <div className={styles.searchSection}></div>
    </div>
  );
};

export default Profile;
