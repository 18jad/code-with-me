import EmptyProfile from "assets/images/empty_profile.png";
import styles from "views/Profile/Profile.module.scss";

const SearchUser = ({ name, username, profile }) => {
  return (
    <div className={styles.user}>
      <div className={styles.userAvatar}>
        <img
          src={(profile && profile.length && require(profile)) || EmptyProfile}
          alt='user avatar'
          className='h-10 aspect-square object-cover rounded-full'
        />
      </div>
      <div className={styles.userInfo}>
        <span className={styles.name}>{name}</span>
        <span className={styles.userName}>@{username}</span>
      </div>
    </div>
  );
};

export default SearchUser;
