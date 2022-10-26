import TextLogo from "components/TextLogo";
import { MagnifyingGlass, SignOut } from "phosphor-react";
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
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <input
            type='text'
            placeholder='Search for a user'
            className='bg-white/5 border shadow-sm pl-10  pr-2 py-2 placeholder-gray-300 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 outline-none rounded transition duration-150 text-white w-full'
          />
          <MagnifyingGlass
            size={22}
            color='#d1d5db'
            className={styles.searchIcon}
            weight='bold'
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
