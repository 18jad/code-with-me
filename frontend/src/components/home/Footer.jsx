import Icon from "assets/icons/icons";
import { tw } from "utils/TailwindComponent";
import footerStore from "../lang/footerStore";
import Logo from "../Logo";

const Footer = ({ contact }) => {
  const lang = localStorage.getItem("lang-preference") || "english";
  const langComp = footerStore[lang];

  const ListChild = tw.li`
        text-gray
        transition
        duration-200
        hover:drop-shadow-wmd
        hover:text-white
        w-fit
        cursor-pointer
        mt-1
        whitespace-nowrap
    `;

  return (
    <div
      className='p-14 flex flex-col lg:flex-row text-white items-center justify-between
    md:px-40 bg-white/10 border-t border-white/30 backdrop-blur-sm mt-40 gap-20 lg:gap-0'>
      <div className='firstSlice flex flex-col gap-4 w-full'>
        <Logo width={50} />
        <p className='logo_name text-xl'>Code With Me</p>
        <span className='copyright text-sm text-gray'>
          {langComp.copyright}
        </span>
        <a
          href='https://github.com/18jad/code-with-me'
          target='_blank'
          rel='noreferrer'
          className='cursor-pointer transition duration-200 hover:drop-shadow-wmd w-fit'>
          <Icon i='github' />
        </a>
      </div>
      <div className='secondSlice flex flex-wrap md:flex-nowrap flex-row md:gap-40 gap-10 w-full'>
        <div className='downloads flex-grow'>
          <span className='title'>{langComp.download.title}</span>
          <ul>
            <ListChild>{langComp.download.web}</ListChild>
            <ListChild>Android</ListChild>
            <ListChild>IOS</ListChild>
          </ul>
        </div>
        <div className='about flex-grow '>
          <span className='title'>{langComp.about.title}</span>
          <ul>
            <ListChild>{langComp.about.docs}</ListChild>
            <ListChild>{langComp.about.us}</ListChild>
            <ListChild onClick={contact}>{langComp.about.contact}</ListChild>
          </ul>
        </div>
        <div className='developers flex-grow'>
          <span className='title'>{langComp.developers}</span>
          <ul>
            <ListChild>
              <a
                href='https://github.com/18jad'
                target='_blank'
                rel='noreferrer'>
                @18jad
              </a>
            </ListChild>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
