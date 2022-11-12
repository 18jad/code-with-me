import { tw } from "utils/TailwindComponent";

const Input = tw.input`
    bg-white/10
    border
    shadow-sm
    px-3
    py-[2px]
    placeholder-gray-400
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    text-sm
    transition
    duration-150
    text-white
    w-11/12
`;

const GithubTool = ({ className }) => {
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>Github</h2>
      <div className='content flex flex-col items-center mt-5 px-2 gap-4 border-b-2 border-[#232526] pb-5'>
        {/* TODO: Change to github connect status */}
        {false ? (
          <>
            <button className='py-1 bg-black/20 w-11/12 rounded border border-white/10 hover:bg-black/40 transition duration-200 flex items-center justify-center text-white gap-3'>
              <GithubTool width={15} />
              <span>Connect to github</span>
            </button>
          </>
        ) : (
          <div className='inputs-wrapper flex flex-col items-center w-full gap-3'>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <label
                htmlFor='repo-name'
                className='text-left self-start ml-3 text-sm'>
                Repository name
              </label>
              <Input placeholder='Enter a name' id='repo-name' />
            </div>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <label
                htmlFor='repo-description'
                className='text-left self-start ml-3 text-sm'>
                Repository description
              </label>
              <textarea
                placeholder='Enter description'
                className='
                  bg-white/10 border shadow-sm px-2 py-1 placeholder-gray-400 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 text-sm outline-none rounded-sm transition duration-150 text-white h-[130px] resize-none w-11/12
              '
                id='repo-description'></textarea>
            </div>
            <button className='px-2 py-1 border border-white/10 rounded text-sm hover:bg-white/10 transition duration-200 shadow'>
              Create and push
            </button>
          </div>
        )}
      </div>
      <div>
        <h2 className='px-4 pt-4 pb-2'>How it works?</h2>
        <div className='px-2'>
          {/* ordered list */}
          <ol className='list-decimal list-inside text-sm text-gray px-2 flex flex-col gap-3'>
            <li>
              <span className='font-bold'>Connect</span> your github account to
              the editor
            </li>
            <li>
              <span className='font-bold'>Choose</span> a repository name
            </li>
            <li>
              <span className='font-bold'>Choose</span> a repository description
              (Optional)
            </li>
            <li>
              <span className='font-bold'>
                Create a repository and push files
              </span>{" "}
              on github by clicking on the button
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GithubTool;
