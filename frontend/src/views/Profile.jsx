import Modal from "components/Modal";
import ProjectCard from "components/profile/ProjectCard";
import SearchUser from "components/profile/SearchUser";
import TextLogo from "components/TextLogo";
import {
  Check,
  MagnifyingGlass,
  NotePencil,
  Plus,
  SignOut,
  UserFocus,
} from "phosphor-react";
import { useState } from "react";
import { tw } from "utils/TailwindComponent";
import styles from "./styles/Profile.module.scss";

// Modal input element tailwind styled component
const ModalInput = tw.input`
    bg-white/10
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-300
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    transition
    duration-150
    text-white
    w-full
`;

// Modal textarea element tailwind styled component
const ModalTextarea = tw.textarea`
    bg-white/10
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-300
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    transition
    duration-150
    text-white
    h-[130px]
    resize-none
    w-full
`;

// Stats card component for profile stats
const StatsCard = ({ count, text }) => {
  return (
    <div className={styles.statsCard}>
      <span className={styles.cardCount}>{count}</span>
      <span className={styles.cardText}>{text}</span>
    </div>
  );
};

const Profile = () => {
  // TODO: use state and store searched user data inside it
  let usersList = false;

  // Search bar value setter and state
  const [searchState, setSearchState] = useState(false);

  // To set edit profile modal status (open or close)
  const [editModalStatus, setEditModalStatus] = useState(false);

  // To set create project modal status (open or close)
  const [projectModalStatus, setProjectModalStatus] = useState(false);

  // To switch between tabs
  const [isOverview, setIsOverview] = useState(true);

  // Hold the data of user favorites projects
  const [favorites, setFavorites] = useState([]);

  // Hold the data of user created projects
  const [projects, setProjects] = useState([0]);

  // Modal change image functionality
  const [modalProfile, setModalProfile] = useState(null);

  // Change image functionality to show image preview when image change
  const changeImage = (e) => {
    const URL = window.URL || window.webkitURL; // create a url
    const file = e.target.files[0]; // get the uploaded file

    if (file) {
      const image = new Image(); // create a new image object

      // check if image loads and wait for it to load
      image.onload = function () {
        if (this.width) {
          // check if the image has a width if yes then it's most likely a valid image not a broken one
          setModalProfile(URL.createObjectURL(file)); // set the image preview to image blob url
        }
      };

      image.src = URL.createObjectURL(file); // set the image object source to image blob
    }
  };

  // Make body unscrollable if any modal is open
  document.body.style.overflow =
    editModalStatus || projectModalStatus ? "hidden" : "auto";

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
          <button
            className='absolute top-4 right-4'
            onClick={() => {
              setEditModalStatus(true);
            }}>
            <span>
              <NotePencil size={20} color='#fff' mirrored={true} />
            </span>
          </button>
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
              onClick={() => setIsOverview(true)}
              hidden
              defaultChecked
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
              onClick={() => setIsOverview(false)}
              hidden
            />
            <div className={styles.selectLine}></div>
            <label htmlFor='favorites' className={styles.switcherTitle}>
              Favorites
            </label>
          </button>
        </div>

        {/* Projects overview */}
        {isOverview ? (
          <div className={styles.projectsOverview}>
            {/* Toolbar */}
            <div className={styles.interBar}>
              <h1 className={styles.sectionTitle}>Your projects</h1>
              <button
                className={styles.createProjectBtn}
                onClick={() => {
                  setProjectModalStatus(true);
                }}>
                <Plus size={18} color='#fff' weight='bold' />
                <span>Create new project</span>
              </button>
            </div>

            {/* TODO: Fix profile feed width if it contains no cards */}

            {/* Projects */}
            {projects.length ? (
              <div className={styles.projectsContainer}>
                {/* TODO: Add message if no project found */}
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
        ) : (
          <div>
            {favorites.length ? (
              <>{/* TODO: Add favorites cards */}</>
            ) : (
              <p className='text-white text-3xl text-center mt-20 px-60'>
                No favorites found :(
              </p>
            )}
          </div>
        )}
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

      {/* Edit profile modal */}
      <Modal
        title='Edit profile'
        isOpen={editModalStatus}
        onClick={() => {
          setEditModalStatus(false);
        }}>
        <div className='content flex flex-row gap-14 items-center'>
          <div
            className='profile text-center h-fit  bg-center bg-cover object-cover rounded'
            style={{
              backgroundImage: modalProfile ? `url(${modalProfile})` : "",
            }}>
            <input
              type='file'
              id='changedProfile'
              hidden
              onChange={(e) => changeImage(e)}
            />
            <label htmlFor='changedProfile' className='cursor-pointer'>
              <UserFocus
                size={100}
                color='#fff'
                weight='fill'
                className={`${modalProfile ? "opacity-0" : "opacity-1"}`}
              />
              <span
                className={`text-sm text-center text-white ${
                  modalProfile ? "hidden" : "block"
                }`}>
                Change profile picture
              </span>
            </label>
          </div>
          <form className='inputs flex flex-col gap-4 w-full'>
            <div className='flex flex-row gap-3'>
              <div className='flex flex-col gap-4 w-full'>
                <ModalInput type='text' placeholder='Full name' required />
                <ModalInput type='text' placeholder='Username' required />
                <ModalInput type='text' placeholder='Headline' required />
              </div>
              <button className='bg-white/10 border-gray-500 border px-1'>
                <Check size={23} color='#fff' weight='bold' />
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Create a new project modal */}
      <Modal
        title='Create new project'
        isOpen={projectModalStatus}
        className='w-[400px]'
        onClick={() => {
          setProjectModalStatus(false);
        }}>
        <form className='inputs flex flex-col gap-4 w-full'>
          <div className='flex flex-col gap-3'>
            <ModalInput type='text' placeholder='Project title' required />
            <ModalTextarea
              type='text'
              placeholder='Project description'
              required
            />
            <button className='bg-white/10 border-gray-500 border p-2 flex items-center justify-center text-white hover:bg-white/5 transition duration-200'>
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
