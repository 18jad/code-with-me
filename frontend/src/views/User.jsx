import ProjectCard from "components/profile/ProjectCard";
import SearchUser from "components/profile/SearchUser";
import TextLogo from "components/TextLogo";
import Transition from "components/Transition";
import { Heart, MagnifyingGlass, SignOut, UserCircle } from "phosphor-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import formatNumber from "utils/FormatNumber";
import styles from "./styles/Profile.module.scss";

// Stats card component for profile stats
const StatsCard = ({ count, text }) => {
  return (
    <div className={styles.statsCard}>
      <span className={styles.cardCount}>{count}</span>
      <span className={styles.cardText}>{text}</span>
    </div>
  );
};

const User = () => {
  // User id passed in url
  let { id } = useParams();

  // TODO: use state and store searched user data inside it
  let usersList = false;

  // Search bar value setter and state
  const [searchState, setSearchState] = useState(false);

  // Hold the data of user created projects
  const [projects, setProjects] = useState([0]);

  return (
    <Transition>
      <div className={styles.pageWrapper}>
        {/* Logo + sign out section*/}
        <div className={styles.interactionsSection}>
          <div className={styles.logo}>
            <TextLogo
              text='Guest profile'
              width={55}
              mainSize='xl'
              textSize='sm'
            />
          </div>
          <div className={styles.interactionsButtons}>
            {/* Go back to profile button */}
            <button className={styles.signOutBtn}>
              <span>
                <UserCircle size={20} color='#fff' mirrored={true} />
              </span>
              <span>Profile</span>
            </button>
            <button className={styles.signOutBtn}>
              {/* Sign out btn */}
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
                Talk is cheap. Show me the code. Talk is cheap. Show me the
                code. Talk is cheap. Show me the code.
              </span>
            </div>
            {/* TODO: if liked set value to liked and change functionality */}
            <button
              className='absolute -bottom-4 text-white flex flex-row gap-2 bg-blue-500 py-1 px-4 rounded-md hover:bg-blue-600 transition duration-200'
              data-liked={false}>
              <Heart size={20} color='#fff' />
              <span>Like</span>
            </button>
          </div>

          {/* Stats Info */}
          <div className={styles.statsWrapper}>
            <StatsCard count={formatNumber(1304324, 1)} text='projects' />
            <StatsCard count={formatNumber(239183, 1)} text='likes' />
            <StatsCard count={formatNumber(2193, 1)} text='favorited' />
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
                defaultChecked
              />
              <div className={styles.selectLine}></div>
              <label htmlFor='overview' className={styles.switcherTitle}>
                Overview
              </label>
            </button>
          </div>

          {/* Projects overview */}
          <div className={styles.projectsOverview}>
            {/* Projects */}
            {projects.length ? (
              <div className={styles.projectsContainer}>
                <>
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                  <ProjectCard
                    title='Project name'
                    description="Porject description, what's the project about"
                    likes={21}
                    updated='Updated 2 days ago'
                    link='/sdadsads'
                  />
                </>
              </div>
            ) : (
              <p className='text-white text-3xl text-center mt-20 px-48'>
                No projects created :(
              </p>
            )}
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
              searchState ? "opacity-1 h-auto" : "opacity-0 h-0"
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
    </Transition>
  );
};

export default User;
