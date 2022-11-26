import { tw } from "utils/TailwindComponent";

// Keyboard shortcuts for editor

const Key = tw.p`
    text-xs
    bg-white/10
    py-1
    px-2
    rounded-sm
    border-b-4
    border-l
    border-r
    border-white/20
    select-none
`;

const KeyHolder = tw.div`
    flex
    flex-row
    justify-between
    items-center
    gap-1
`;

const DoubleKey = ({ command, firstKey, secondKey }) => {
  return (
    <div className='flex flex-row justify-between items-center'>
      <p className='text-sm'>{command}:</p>
      <KeyHolder>
        <Key className='text-xs'>{firstKey}</Key>
        <span>+</span>
        <Key className='text-xs'>{secondKey}</Key>
      </KeyHolder>
    </div>
  );
};

const TripleKey = ({ command, firstKey, secondKey, thirdKey }) => {
  return (
    <div className='flex flex-row justify-between items-center'>
      <p className='text-sm'>{command}:</p>
      <KeyHolder>
        <Key className='text-xs'>{firstKey}</Key>
        <span>+</span>
        <Key className='text-xs'>{secondKey}</Key>
        <span>+</span>
        <Key className='text-xs'>{thirdKey}</Key>
      </KeyHolder>
    </div>
  );
};

const Shortcuts = ({ className }) => {
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2 sticky top-0 self-stretch bg-[#1e1e1e] overflow-hidden'>
        Shortcuts
      </h2>
      <div className='flex flex-col py-3 px-4'>
        <p className='text-sm text-center mb-3'>
          Keyboard shortcuts for editor:
        </p>
        <div className='flex flex-col mt-2 gap-4'>
          <DoubleKey command='Save file' firstKey='Ctrl' secondKey='S' />
          <TripleKey
            command='Format code'
            firstKey='Shift'
            secondKey='Alt'
            thirdKey='F'
          />
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;
