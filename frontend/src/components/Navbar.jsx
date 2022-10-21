import Icon from "assets/icons/icons";
import Logo from "components/Logo";
import { Link } from "react-router-dom";

const Navbar = () => {
  const linkCss =
    "text-gray font-semibold transition duration-200 hover:text-white";
  return (
    <div className='flex items-center justify-center md:justify-between px-10 py-5 w-screen'>
      <Link to='/'>
        <div className='flex items-center justify-center gap-5'>
          <Logo width={44} />
          <span className='text-xl font-bold text-white'>Code With Me</span>
        </div>
      </Link>
      <div className='hidden md:flex'>
        <li className='flex items-center justify-center gap-10'>
          <Link to='/docs' className={linkCss}>
            Docs
          </Link>
          <Link to='/downloads' className={linkCss}>
            Download
          </Link>
          <Link to='#contact' className={linkCss}>
            Contact
          </Link>
        </li>
      </div>
      <div className='hidden md:block'>
        <a
          href='https://github.com'
          target='_blank'
          rel='noreferrer'
          title='Github Repo'>
          <Icon
            i='github'
            width={30}
            className='text-gray transition duration-200 hover:text-white'
          />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
