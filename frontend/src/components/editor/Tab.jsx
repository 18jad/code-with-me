// Deprecated, feature removed, keeping code for future reference

// import { X } from "phosphor-react";
// import { useState } from "react";
// import { AiOutlineFile } from "react-icons/ai";
// import FILE_ICONS from "./FileTree/FileIcons";
// import styles from "./Tab.module.scss";

// const EditorTab = ({ name, onClick, className, dataFile, isSelected }) => {
//   const fileExtension = name?.split(".").pop();
//   const [show, setShow] = useState(true);
//   return (
//     show && (
//       <div className='relative overflow-hidden' title={name}>
//         <input
//           type='radio'
//           name='tabs'
//           className={styles.radioSelect}
//           data-file={name}
//           data-selected={isSelected}
//           onClick={onClick}
//         />
//         <div
//           className={`${className} ${styles.tab}
//             w-fit py-1 px-3 rounded cursor-pointer transition duration-200 flex flex-row gap-2  items-center justify-center select-none relative `}>
//           <div className='icon'>
//             {FILE_ICONS[fileExtension] ? (
//               FILE_ICONS[fileExtension]
//             ) : (
//               <AiOutlineFile />
//             )}
//           </div>
//           <p className='file_name text-white truncate max-w-[130px]'>{name}</p>
//           <X
//             color='#FFF'
//             size={15}
//             weight='bold'
//             onClick={() => setShow(false)}
//             className='hover:bg-gray-400/10 p-[2px] rounded-full'
//             title='close'
//           />
//         </div>
//       </div>
//     )
//   );
// };

// export default EditorTab;
