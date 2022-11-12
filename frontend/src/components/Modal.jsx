import { X } from "phosphor-react";

const Modal = ({
  isOpen,
  title,
  children,
  onClick,
  bgDrop,
  bg = "#333",
  className = [],
}) => {
  return (
    <div
      className={`${
        bgDrop ||
        " bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#333]/10 via-black/30 to-black/40"
      } w-screen h-screen background_modal fixed ${
        isOpen
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } top-1/2 left-1/2 -translate-x-1/2 transition duration-200 -translate-y-1/2 grid place-content-center `}
      onClick={onClick}>
      <div
        className={
          `modal bg-[${
            bg ? bg : " bg-gray-800 "
          }] flex flex-col shadow-lg border-2 border-white/20 items-center justify-center h-fit transition duration-500 gap-10 p-10 rounded relative ${
            isOpen ? "opacity-1" : "opacity-0"
          }` +
          " " +
          [...className].join("")
        }
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <X
          className='close_modal text-white absolute top-4 left-4 cursor-pointer hover:text-white/60 transition duration-200'
          weight='bold'
          color='currentColor'
          size={20}
          onClick={onClick}
        />
        <h1 className='text-white text-3xl'>{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Modal;
