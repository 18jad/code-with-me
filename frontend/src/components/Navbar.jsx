import Icon from "assets/icons/icons";
import Logo from "components/Logo";
import { Link } from "react-router-dom";
import navStore from "./lang/navStore";

const Navbar = ({ contact }) => {
  // link styling
  const linkCss =
    "text-gray font-semibold transition duration-200 hover:text-white select-none hover:drop-shadow-wmd";

  const lang = localStorage.getItem("lang-preference") || "english";
  const langComp = navStore[lang];

  return (
    <div className='flex items-center justify-center md:justify-between px-10 py-5 w-screen'>
      <Link to='/'>
        <div className='flex items-center justify-center gap-5 select-none hover:drop-shadow-wmd transition duration-200'>
          <Logo width={44} />
          <span className='text-xl font-bold text-white mt-1'>
            Code With Me
          </span>
        </div>
      </Link>
      <div className='hidden md:flex mr-20'>
        <li className='flex items-center justify-center gap-10'>
          <Link to='/docs' className={linkCss}>
            {langComp.docs}
          </Link>
          <Link to='/downloads' className={linkCss}>
            {langComp.download}
          </Link>
          <Link onClick={contact} className={linkCss}>
            {langComp.contact}
          </Link>
        </li>
      </div>
      <div className='hidden md:block '>
        <a
          href='https://github.com'
          target='_blank'
          rel='noreferrer'
          title='Github Repo'>
          <Icon
            i='github'
            width={30}
            className='text-gray transition duration-200 hover:text-white hover:drop-shadow-wmd'
          />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
