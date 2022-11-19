const Message = ({ message, time, senderName, isMe, type }) => {
  return type === "user" ? (
    <div
      className={`message flex flex-col max-w-[200px] mb-2 ${
        isMe
          ? "items-end float-right clear-both"
          : "items-start float-left clear-both"
      }`}>
      <span className={`text-xs text-gray ${isMe ? "mr-1" : "ml-1"}`}>
        {senderName}
      </span>
      <p
        className={`text-sm ${
          isMe ? "bg-gray-600/25" : "bg-blue-500"
        } px-2 py-1 rounded-lg`}>
        {message}
      </p>
      <span
        className={`text-[10px] text-gray mt-1 text-end ${
          isMe ? "mr-1" : "ml-1"
        }`}>
        {time}
      </span>
    </div>
  ) : (
    <div className='message flex flex-col mb-2 items-center  clear-both'>
      <p className='text-xs px-2 py-1 rounded-lg'>{message}</p>
      <span className='text-[10px] text-gray text-end ml-1'>{time}</span>
    </div>
  );
};

export default Message;
