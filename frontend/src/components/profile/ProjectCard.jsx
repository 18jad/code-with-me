import { Heart } from "phosphor-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ title, description, likes, updated, link }) => {
  return (
    <Link
      to={link}
      className='w-full bg-[#3E3E3E] py-3 pl-6 pr-3 rounded-lg flex flex-col justify-between border border-white/30 text-white cursor-pointer select-none transition duration-200 hover:bg-[#3E3E3E]/80 hover:scale-[1.01]'>
      <div className='titles flex flex-col items-start justify-center mb-5 w-fit'>
        <p className='text-2xl'>{title}</p>
        <p className='text-[#B6B6B6] font-light'>{description}</p>
      </div>
      <div className='bottom-bar flex flex-row justify-between items-center'>
        <div className='likes flex flex-row gap-1'>
          <Heart size={20} color='#D1D1D1' weight='fill' />
          <span className='text-[#D1D1D1] text-base'>{likes}</span>
        </div>
        <div className='updated'>
          <p className='text-xs text-[#B6B6B6]'>{updated}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
