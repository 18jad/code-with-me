const FolderOpened = ({ width, height, className }) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 18 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M15.6335 1.75H8.8335L7.1335 0H2.0335C1.0985 0 0.341996 0.7875 0.341996 1.75L0.333496 12.25C0.333496 13.2125 1.0985 14 2.0335 14H15.6335C16.5685 14 17.3335 13.2125 17.3335 12.25V3.5C17.3335 2.5375 16.5685 1.75 15.6335 1.75ZM15.6335 12.25H2.0335V3.5H15.6335V12.25Z'
        fill='#D5D5D5'
      />
    </svg>
  );
};

export default FolderOpened;
