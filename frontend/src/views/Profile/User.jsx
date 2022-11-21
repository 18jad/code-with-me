import ProjectCard from "components/profile/ProjectCard";
import SearchUser from "components/profile/SearchUser";
import TextLogo from "components/TextLogo";
import Transition from "components/Transition";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import { Heart, MagnifyingGlass, SignOut, UserCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formatNumber from "utils/formatNumber";
import NotFound from "views/NotFound/NotFound";
import { logout } from "./logout";
import styles from "./Profile.module.scss";
import { ProfileController } from "./profileController";

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
  // User controller
  const userController = new ProfileController();

  // User id passed in url
  let { id } = useParams();

  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState({ user: true, isLiked: null });

  // Hold the data of user created projects
  const [projects, setProjects] = useState([0]);

  const [userLikes, setUserLikes] = useState(0);

  const { user: loggedUser } = useSelector((state) => state.user);

  // Fetch user info
  useEffect(() => {
    userController
      .fetchUser(id)
      .then((user) => {
        userController
          .checkIfLiked(loggedUser.id, user.id)
          .then(({ isLiked: { isLiked } }) => {
            setProfileUser({ user, isLiked });
          })
          .catch((err) => {
            setProfileUser({ user, isLiked: false });
          });
        setProjects(user.projects);
        setUserLikes(user.likesCount);
      })
      .catch((error) => {
        setProfileUser({ user: false, isLiked: false });
      });
  }, []);

  let [usersList, setUsersList] = useState([]);

  // Search bar value setter and state
  const [searchState, setSearchState] = useState(false);

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // Search user
  const debouncedQuery = useDebounce(searchTerm, 500);

  const user = profileUser.user;

  useEffect(
    () => {
      if (debouncedQuery) {
        userController.searchUser(debouncedQuery).then((users) => {
          setUsersList(users);
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
      {user ? (
        <div className={styles.pageWrapper}>
          {/* Logo + sign out section*/}
          <div className={styles.interactionsSection}>
            <div className={styles.logo}>
              <TextLogo
                text={`${id} profile`}
                width={55}
                mainSize='xl'
                textSize='sm'
              />
            </div>
            <div className={styles.interactionsButtons}>
              {/* Go back to profile button */}
              <button
                className={styles.signOutBtn}
                onClick={() => {
                  navigate("/profile");
                }}>
                <span>
                  <UserCircle size={20} color='#fff' mirrored={true} />
                </span>
                <span>Profile</span>
              </button>
              <button
                className={styles.signOutBtn}
                onClick={() => {
                  logout(navigate);
                }}>
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
                <img src={user?.avatar} alt='profile avatar' />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.userNames}>
                  <span className={styles.name}>{user?.name}</span>
                  <span className={styles.username}>@{user?.username}</span>
                </div>
                <span className={styles.headline}>{user?.headline}</span>
              </div>
              <button
                className={`absolute -bottom-4 text-white flex flex-row gap-2  py-1 px-4 rounded-md  transition duration-200 ${
                  profileUser.isLiked
                    ? "bg-red-400 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => {
                  userController
                    .updateLike(user.id)
                    .then(({ message, success, result: user }) => {
                      setUserLikes(user.likesCount);
                      setProfileUser({ user, isLiked: !profileUser.isLiked });
                    })
                    .catch((err) => {
                      console.log(err);
                      // setProfileUser({ user, isLiked: false });
                    });
                }}
                data-liked={true}>
                <Heart
                  size={20}
                  color='#fff'
                  weight={`${profileUser.isLiked ? "fill" : "bold"}`}
                />
                <span>{profileUser.isLiked ? "Unlike" : "Like"}</span>
              </button>
            </div>

            {/* Stats Info */}
            <div className={styles.statsWrapper}>
              <StatsCard
                count={formatNumber(user.projectsCount, 1)}
                text='projects'
              />
              <StatsCard
                count={formatNumber(user.likesCount, userLikes)}
                text='likes'
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
                    {projects.map(
                      ({ title, description, updatedAt }, index) => (
                        <ProjectCard
                          title={title}
                          description={description}
                          updated={moment(updatedAt).fromNow()}
                          link={`/project/${title}`}
                          key={index}
                        />
                      ),
                    )}
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
                  setSearchTerm(searchValue);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setSearchState(false);
                  }, 100);
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
              className={`${
                styles.searchResultWrapper
              } transition duration-300 ${
                searchState ? "opacity-1 h-auto" : "opacity-0 h-0"
              }`}>
              {usersList.length ? (
                <>
                  {usersList.map(({ username, name }) => (
                    <Link to={`/user/${username}`}>
                      <SearchUser name={name} username={username} />
                    </Link>
                  ))}
                </>
              ) : (
                <p className='text-white text-center py-2'>No results found</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </Transition>
  );
};

export default User;
