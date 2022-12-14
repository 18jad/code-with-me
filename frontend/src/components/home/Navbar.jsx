import Icon from "assets/icons/icons";
import Logo from "components/Logo";
import { useState } from "react";
import { Link } from "react-router-dom";
import { tw } from "utils/TailwindComponent";
import navStore from "../lang/navStore";

const Navbar = ({ contact, fn, auth }) => {
  const [nav, setNav] = useState(false);

  // link element styling
  const linkCss =
    "text-gray font-semibold transition duration-200 hover:text-white select-none hover:drop-shadow-wmd";

  const lang = localStorage.getItem("lang-preference") || "english"; // get language preference
  const langComp = navStore[lang]; // store translated informations

  // select element styling
  const Select = tw.select`
    bg-transparent
    text-white
    font-semibold
    text-sm
    outline-none
    border-none
    cursor-pointer
    transition 
    duration-200
    hover:text-gray
    px-2
    py-1
    hover:drop-shadow-wmd
  `;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  });

  return (
    <div
      className={`flex items-center justify-between border-b px-10 w-screen fixed top-0 z-50 transition-all duration-200 ${
        nav
          ? "bg-black/20 backdrop-blur-md border-white/10 py-2"
          : "bg-transparent border-transparent py-5"
      }`}>
      <Link to='/'>
        <div className='flex items-center justify-center gap-5 select-none hover:drop-shadow-wmd transition duration-200'>
          <Logo width={44} />
          <span className='text-xl font-bold text-white mt-1'>
            Code With Me
          </span>
        </div>
      </Link>
      <div className='hidden md:flex '>
        <li className='flex items-center justify-center gap-10 mr-14'>
          <Link onClick={contact} className={linkCss}>
            {langComp.contact}
          </Link>
          <Link to={auth ? "/profile" : "/authenticate"} className={linkCss}>
            {auth ? langComp.goapp : langComp.register}
          </Link>
        </li>
      </div>
      <div className='flex flex-row gap-5'>
        <Select
          onChange={(e) => {
            fn(e);
          }}
          title='Change Language'
          defaultValue={lang}>
          <option value='english' className='bg-black'>
            en
          </option>
          <option value='french' className='bg-black'>
            fr
          </option>
          <option value='chinese' className='bg-black'>
            ch
          </option>
        </Select>
        <a
          href='https://github.com/18jad/code-with-me'
          target='_blank'
          rel='noreferrer'
          className='hidden md:block '
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
