import Message from "./editor/Message";

const ChatConversation = ({ className }) => {
  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2 sticky top-0 self-stretch bg-[#1e1e1e] overflow-hidden'>
        Chat
      </h2>
      <div className='chat-section'>
        <div className='messages-container p-2 overflow-auto h-[720px]'>
          <Message
            message='first message'
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
          <Message
            message="Hello it's me jad the beast jahaahhah"
            time='12:32'
            isMe={false}
            senderName='Jad Yahya'
          />
          <Message
            message='last message last messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast messagelast message'
            time='12:32'
            isMe={true}
            senderName='Jad Yahya'
          />
        </div>
        <form action=''>
          <input
            type='text'
            className='fixed bottom-0 w-[260px] px-3 bg-[#232526] py-3  border-t border-white/5 outline-none'
            placeholder='Enter a message'
            required
          />
        </form>
      </div>
    </div>
  );
};

export default ChatConversation;
