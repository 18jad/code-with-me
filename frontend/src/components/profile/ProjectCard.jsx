import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";

const ProjectCard = ({ title, description, updated, link, created }) => {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.2}
      // tiltEnable={false}
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      perspective={650}
      glarePosition='all'
      className='w-full bg-[#3E3E3E] py-4 px-8 rounded-lg flex flex-col justify-between border border-white/30 text-white cursor-pointer select-none transition duration-200 hover:bg-[#3E3E3E]/80 hover:scale-[1.01]'
      style={{ transformStyle: "preserve-3d" }}>
      <Link to={link} style={{ transform: "translateZ(35px)" }}>
        <div className='titles flex flex-col items-start justify-center mb-5 w-fit'>
          <p className='text-2xl'>{title}</p>
          <p className='text-[#B6B6B6] font-light'>{description}</p>
        </div>
        <div className='bottom-bar flex flex-row justify-between items-center'>
          <div className='created'>
            <p className='text-xs text-[#B6B6B6]'>{created}</p>
          </div>
          <div className='updated'>
            <p className='text-xs text-white'>{updated}</p>
          </div>
        </div>
      </Link>
    </Tilt>
  );
};

export default ProjectCard;
