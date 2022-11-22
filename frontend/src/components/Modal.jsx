import { X } from "phosphor-react";
import { AiOutlineFullscreen } from "react-icons/ai";

const Modal = ({
  isOpen,
  title,
  children,
  onClick,
  onFull,
  className = [],
}) => {
  return (
    <div
      className={`bg-black/30 w-screen h-screen background_modal fixed ${
        isOpen
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } top-1/2 left-1/2 -translate-x-1/2 transition duration-200 -translate-y-1/2 grid place-content-center backdrop-blur-[3px]`}
      onClick={onClick}>
      <div
        className={
          `modal bg-[#1e1e1e] flex flex-col shadow-lg border-2 border-white/20 items-center justify-center h-fit transition-all duration-300 ${
            children.type === "iframe" ? "p-2 pt-3" : "p-10 gap-10"
          } rounded relative ${isOpen ? "opacity-1" : "opacity-0"}` +
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
        {children.type === "iframe" && (
          <AiOutlineFullscreen
            className='close_modal font-bold text-white absolute top-4 right-4 cursor-pointer hover:text-white/60 transition duration-200 text-xl'
            onClick={onFull}
          />
        )}
        <div className={`${children.type === "iframe" ? "w-full h-full" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
