const infoStore = {
  collab: {
    title: "Collaboration Power",
    body: "Bored to code alone and to explain your code for your friends without visualizing it? We got you. Code along with your friends and chat with them directly throught the editor using voice chat or messaging feature.",
    image: require("../assets/collaboration.svg").default,
  },
  github: {
    title: "Github integration",
    body: "In addition to your online profile storage, we did integrate your favorite code hosting platform Github! in case you want to share your code there! Push and import files directly from there.",
    image: require("../assets/github.png"),
    classMame: "w-[270px]",
  },
};

const IdeInfo = () => {
  return (
    <>
      {Object.entries(infoStore).map(([key, value]) => {
        return (
          <div
            className='flex flex-col md:flex-row items-center justify-center  md:w-2/3 gap-10 mx-auto lg:gap-40'
            key={key}>
            <img
              src={value.image}
              alt={value.title}
              title={key}
              className={value.classMame || ""}
            />
            <div className='flex flex-col justify-center gap-2 md:w-1/2 mx-10 text-left text-white lg:scale-125 '>
              <h1 className='text-xl md:text-4xl lg:text-6xl '>
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
