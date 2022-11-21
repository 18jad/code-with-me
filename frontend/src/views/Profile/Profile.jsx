import Modal from "components/Modal";
import ProjectCard from "components/profile/ProjectCard";
import SearchUser from "components/profile/SearchUser";
import TextLogo from "components/TextLogo";
import Transition from "components/Transition";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import {
  Check,
  MagnifyingGlass,
  NotePencil,
  Plus,
  SignOut,
  UserFocus,
} from "phosphor-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogin } from "store/slices/loginSlice";
import formatNumber from "utils/formatNumber";
import { notificationToaster } from "utils/notificationToaster";
import { tw } from "utils/TailwindComponent";
import { logout } from "./logout";
import styles from "./Profile.module.scss";
import { ProfileController } from "./profileController";

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
  let [usersList, setUsersList] = useState([]);

  // Search bar value setter and state
  const [searchState, setSearchState] = useState(false);

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // To set edit profile modal status (open or close)
  const [editModalStatus, setEditModalStatus] = useState(false);

  // To set create project modal status (open or close)
  const [projectModalStatus, setProjectModalStatus] = useState(false);

  // To switch between tabs
  const [isOverview, setIsOverview] = useState(true);

  // Hold the data of user collabed projects
  const [collabs, setCollabs] = useState([]);

  const [myProject, setMyProject] = useState([]);

  // Event dispatcher
  const dispatch = useDispatch();

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

  // Navigator
  const navigate = useNavigate();

  // Profile controller
  const profile = new ProfileController();

  // Make body unscrollable if any modal is open
  document.body.style.overflow =
    editModalStatus || projectModalStatus ? "hidden" : "auto";

  console.log(useSelector((state) => state));

  // Logged in user
  const loggedUser = useSelector((state) => state.user.user);
  const {
    username,
    name,
    headline,
    avatar,
    likesCount,
    projectsCount,
    projects,
  } = loggedUser || {
    username: "",
    name: "",
    headline: "",
    likesCount: 0,
    projectsCount: 0,
    projects: [],
  };

  useEffect(() => {
    if (projects && projects.length) {
      setMyProject(projects);
    }
  }, [projects]);

  // Authentication token
  const authToken = useSelector((state) => state.user.token);

  // Search user
  const debouncedQuery = useDebounce(searchTerm, 500);

  // Self fetch profile
  useEffect(() => {
    profile.fetchUser(username).then((res) => {
      dispatch(setLogin({ user: res, token: authToken }));
    });
    profile
      .getCollabProjects()
      .then(({ projects }) => {
        setCollabs(projects);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(
    () => {
      if (debouncedQuery) {
        profile.searchUser(debouncedQuery).then((users) => {
          if (users.length) {
            setUsersList(users);
          } else {
            setUsersList([]);
          }
        });
      } else {
        setUsersList([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery], // Only call effect if debounced query term changes
  );

  return (
    <Transition>
      <div className={styles.pageWrapper}>
        {/* Logo + sign out section*/}
        <div className={styles.interactionsSection}>
          <div className={styles.logo}>
            <TextLogo text='Profile' width={55} mainSize='xl' textSize='sm' />
          </div>
          <div className={styles.mobileLogo}>
            <TextLogo text='Profile' width={35} mainSize='xs' textSize='xs' />
          </div>
          <div className={styles.interactionsButtons}>
            <button
              className={styles.signOutBtn}
              onClick={() => {
                logout(navigate);
              }}>
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
              <img src={avatar} alt='profile avatar' />
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.userNames}>
                <span className={styles.name}>{name}</span>
                <span className={styles.username}>@{username}</span>
              </div>
              <span className={styles.headline}>{headline || ""}</span>
            </div>
          </div>

          {/* Stats Info */}
          <div className={styles.statsWrapper}>
            <StatsCard
              count={formatNumber(projectsCount || 0, 1)}
              text='projects'
            />
            <StatsCard count={formatNumber(likesCount || 0, 1)} text='likes' />
            <StatsCard
              count={formatNumber(collabs?.length || 0, 1)}
              text='collabs'
            />
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
                id='collabs'
                name='sectionSwitcher'
                className={styles.radioSelection}
                onClick={() => setIsOverview(false)}
                hidden
              />
              <div className={styles.selectLine}></div>
              <label htmlFor='collabs' className={styles.switcherTitle}>
                Collabs
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
              {myProject?.length ? (
                <div className={styles.projectsContainer}>
                  <>
                    {myProject.map(
                      ({ title, description, updatedAt, createdAt }, index) => (
                        <ProjectCard
                          title={title}
                          description={description}
                          updated={`Updated ${moment(updatedAt).fromNow()}`}
                          created={`Created ${moment(createdAt).fromNow()}`}
                          link={`/project/${title}`}
                          key={index}
                        />
                      ),
                    )}
                  </>
                </div>
              ) : (
                <p className='text-white text-3xl text-center my-20 md:px-48'>
                  No projects created :(
                </p>
              )}
            </div>
          ) : (
            <div className={styles.projectsOverview}>
              {/* Toolbar */}
              {collabs?.length ? (
                <>
                  <div className={styles.interBar}>
                    Project you have collaborated and have access to:
                  </div>
                  <div className={styles.projectsContainer}>
                    <>
                      {collabs.map(
                        (
                          { title, description, updatedAt, createdAt },
                          index,
                        ) => (
                          <ProjectCard
                            title={title}
                            description={description}
                            updated={`Updated ${moment(updatedAt).fromNow()}`}
                            created={`Created ${moment(createdAt).fromNow()}`}
                            link={`/project/${title}`}
                            key={index}
                          />
                        ),
                      )}
                    </>
                  </div>
                </>
              ) : (
                <p className='text-white text-3xl text-center p-0 my-20 md:px-60'>
                  No collabs found {":("}
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
                setSearchState(Boolean(searchValue.trim()?.length > 0));
                setSearchTerm(searchValue);
              }}
              onBlur={(e) =>
                setTimeout(() => {
                  setSearchState(false);
                }, 100)
              }
              onFocus={(e) => {
                let searchValue = e.target.value;
                setSearchState(Boolean(searchValue.trim()?.length > 0));
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
            {usersList &&
            usersList.filter((user) => {
              if (user.username === username) return false;
              return true;
            })?.length ? (
              <>
                {usersList
                  .filter((user) => {
                    if (user.username === username) return false; // dont show current logged in user in search results
                    return true;
                  })
                  .map(({ username, name, avatar }) => (
                    <Link to={`/user/${username}`}>
                      <SearchUser
                        name={name}
                        username={username}
                        profile={avatar}
                      />
                    </Link>
                  ))}
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
          className='bg-[#333]'
          onClick={() => {
            setEditModalStatus(false);
          }}>
          <div className='content flex flex-col md:flex-row gap-14 items-center'>
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
              <label
                htmlFor='changedProfile'
                className='cursor-pointer flex flex-col items-center'>
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
            <form
              className='inputs flex flex-col gap-4 w-full'
              onSubmit={(e) => {
                profile
                  .editProfile(e)
                  .then(({ response: { data } }) => {
                    const { updatedUser: user, newToken: token } = data;
                    notificationToaster(data.message);
                    dispatch(setLogin({ user, token }));
                  })
                  .catch(({ response: { data } }) =>
                    notificationToaster(data.message, true),
                  );
              }}>
              <div className='flex flex-col md:flex-row gap-3'>
                <div className='flex flex-col gap-4 w-full'>
                  <ModalInput
                    type='text'
                    placeholder='Full name'
                    defaultValue={name}
                    name='name'
                    required
                  />
                  <ModalInput
                    type='text'
                    placeholder='Username'
                    defaultValue={username}
                    name='username'
                    required
                  />
                  <ModalInput
                    type='text'
                    placeholder='Headline'
                    defaultValue={headline || ""}
                    name='headline'
                  />
                </div>
                <button className='bg-white/10 border-gray-500 border px-1 flex items-center justify-center'>
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
          className='w-[400px] scale-90 md:scale-100'
          onClick={() => {
            setProjectModalStatus(false);
          }}>
          <form
            className='inputs flex flex-col gap-4 w-full'
            onSubmit={(e) => {
              profile
                .createProject(e)
                .then((res) => {
                  notificationToaster(
                    res.data.message + ". Redirecting to project page...",
                  );
                  setTimeout(() => {
                    navigate(`/project/${res.data.project.title}`);
                  }, 2000);
                })
                .catch((error) =>
                  notificationToaster(
                    error.response?.data?.message || error,
                    true,
                  ),
                );
            }}>
            <div className='flex flex-col gap-3'>
              <ModalInput
                type='text'
                placeholder='Project title'
                name='title'
                required
              />
              <ModalTextarea
                type='text'
                name='description'
                placeholder='Project description'
                required
              />
              <p className='text-xs text-gray'>
                *Project title should be unique and alphanumeric, it can
                contains dashes (-), no spaces allowed.
              </p>
              <button className='bg-white/10 border-gray-500 border p-2 flex items-center justify-center text-white hover:bg-white/5 transition duration-200'>
                Create
              </button>
            </div>
          </form>
        </Modal>
      </div>
      <Toaster position='bottom-center' reverseOrder={false} />
    </Transition>
  );
};

export default Profile;
