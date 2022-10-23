import infoStore from "../lang/infoStore";

const IdeInfo = () => {
  const lang = localStorage.getItem("lang-preference") || "english";

  return (
    <>
      {Object.values(infoStore[lang]).map((value) => {
        return (
          <div
            className='flex flex-col md:flex-row items-center justify-center  md:w-2/3 gap-10 mx-auto lg:gap-40'
            key={value.title}>
            <img
              src={value.image}
              alt={value.title}
              title={value.title}
              className={value.classMame || ""}
            />
            <div className='flex flex-col justify-center gap-2 md:w-1/2 mx-10 text-left text-white lg:scale-125 '>
              <h1 className='text-xl md:text-4xl lg:text-5xl '>
                {value.title}
              </h1>
              <p className='font-thin md:text-md lg:text-lg'>{value.body}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default IdeInfo;
