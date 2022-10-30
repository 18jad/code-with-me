import JoinVc from "assets/icons/JoinVc";
import { MicrophoneSlash } from "phosphor-react";

const VoiceChat = ({ className }) => {
  const voiceChatStarted = true;

  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2 sticky top-0 self-stretch bg-[#1e1e1e] overflow-hidden'>
        Voice Chat
      </h2>
      <div className='content flex flex-col relative items-center '>
        {voiceChatStarted ? (
          <div className='flex flex-col gap-4 items-center justify-center w-4/5 mb-6 mt-4'>
            <button className='flex flex-row items-center justify-center gap-2 border py-1 w-full rounded border-white/10 text-sm hover:bg-white/5 transition-colors duration-150 [text-shadow:0_0_8px_#0000007d]'>
              <MicrophoneSlash size={17} className='mb-1' color='#fff' />
              <span>Mute</span>
            </button>
            <button className='flex flex-row items-center justify-center gap-2 border py-1 w-full rounded border-red-500/40 hover:bg-red-500/20 text-sm text-red-400 tranistion-colors duration-150 hover:text-red-600 hover:text-shadow [text-shadow:0_0_8px_#0000007d]'>
              Leave
            </button>
          </div>
        ) : (
          <div className='mb-6'>
            <button className='rounded-full mt-4 drop-shadow-vc hover:drop-shadow-vch transition duration-200 hover:scale-105 w-fit h-fit'>
              <JoinVc width={130} />
            </button>
          </div>
        )}
        <div className='border-t-2 border-[#232526]'>
          <h2 className='px-4 pt-4 pb-2'>How it works?</h2>
          <div className='px-2'>
            {/* ordered list */}
            <ol className='list-decimal list-inside text-sm text-gray px-2 flex flex-col gap-3'>
              <li>
                Voicechat is automatically initiated when you join a project
                room.
              </li>
              <li>
                <span className='font-bold'>Click</span> join voicechat button
                to join the voicechat.
              </li>
              <li>
                Once you join. <span className='font-bold'>Click</span> the{" "}
                <span className='font-bold'>mute button </span>to mute yourself,
                or the <span className='font-bold'>leave button </span>to leave
                the voicechat.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
