import SearchUser from "components/profile/SearchUser";
import TextLogo from "components/TextLogo";
import { MagnifyingGlass, Plus, SignOut } from "phosphor-react";
import { useState } from "react";
import styles from "./styles/Profile.module.scss";

const StatsCard = ({ count, text }) => {
  return (
    <div class={styles.statsCard}>
      <span className={styles.cardCount}>{count}</span>
      <span className={styles.cardText}>{text}</span>
    </div>
  );
};

const Profile = () => {
  // TODO: use state and store searched user data inside it
  let usersList = false;

  const [searchState, setSearchState] = useState(false);

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
      <div className={styles.profileFeedSection}>
        {/* Profile Card */}
        <div className={styles.profileContainer}>
          <div className={styles.profileAvatar}>
            <img
              src={require("assets/images/empty_profile.png")}
              alt='profile avatar'
            />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.userNames}>
              <span className={styles.name}>John Doe</span>
              <span className={styles.username}>@johndoe</span>
            </div>
            <span className={styles.headline}>
              Talk is cheap. Show me the code. Talk is cheap. Show me the code.
              Talk is cheap. Show me the code.
            </span>
          </div>
        </div>

        {/* Stats Info */}
        <div className={styles.statsWrapper}>
          <StatsCard count={201} text='projects' />
          <StatsCard count={42} text='likes' />
          <StatsCard count={21} text='favorited' />
        </div>

        {/* Section Switcher */}
        <div className={styles.sectionSwitcher}>
          {/* Overview tab switcher */}
          <button className={styles.sectionSwitcherBtn}>
            <input
              type='radio'
              id='overview'
              name='sectionSwitcher'
              className={styles.radioSelection}
              hidden
            />
            <div className={styles.selectLine}></div>
            <label htmlFor='overview' className={styles.switcherTitle}>
              Overview
            </label>
          </button>
          {/* Favorties tab switcher */}
          <button className={styles.sectionSwitcherBtn}>
            <input
              type='radio'
              id='favorites'
              name='sectionSwitcher'
              className={styles.radioSelection}
              hidden
            />
            <div className={styles.selectLine}></div>
            <label htmlFor='favorites' className={styles.switcherTitle}>
              Favorites
            </label>
          </button>
        </div>

        {/* Projects overview */}
        <div className={styles.projectsOverview}>
          {/* Toolbar */}
          <div className={styles.interBar}>
            <h1 className={styles.sectionTitle}>Your projects</h1>
            <button className={styles.createProjectBtn}>
              <Plus size={18} color='#fff' weight='bold' />
              <span>Create new project</span>
            </button>
          </div>

          {/* Projects */}
        </div>
      </div>

      {/* Search section */}
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <input
            type='text'
            placeholder='Search for a user'
            className='bg-white/5 border shadow-sm pl-10  pr-2 py-2 placeholder-gray-300 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 outline-none rounded transition duration-150 text-white w-full'
            onChange={(e) => {
              let searchValue = e.target.value;
              setSearchState(Boolean(searchValue.trim().length > 0));
            }}
            onBlur={() => {
              setSearchState(false);
            }}
            onFocus={(e) => {
              let searchValue = e.target.value;
              setSearchState(Boolean(searchValue.trim().length > 0));
            }}
          />
          <MagnifyingGlass
            size={22}
            color='#d1d5db'
            className={styles.searchIcon}
            weight='bold'
          />
        </div>
        <div
          className={`${styles.searchResultWrapper} transition duration-300 ${
            searchState ? "opacity-1" : "opacity-0"
          }`}>
          {/* TODO: Change opacity based on fetched user list */}
          {usersList ? (
            <>
              <SearchUser name='John Doe1' username='john_doe' />
              <SearchUser name='John Doe' username='john_doe' />
              <SearchUser name='John Doe' username='john_doe' />
            </>
          ) : (
            <p className='text-white text-center py-2'>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
