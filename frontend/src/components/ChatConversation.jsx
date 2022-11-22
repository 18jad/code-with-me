import useDebounce from "hooks/useDebounce";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Message from "./editor/Message";

const ChatConversation = ({ className, socket }) => {
  const { id } = useParams();

  const loggedUser = useSelector((state) => state.user.user);

  const room = id;

  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);

  const debounceTyping = useDebounce(typing, 1500);

  const sendMessage = (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit("send_message", {
      message,
      user: { username: loggedUser.username, name: loggedUser.name },
      room,
    });
    e.target.elements.message.value = "";
  };

  const receiveMessage = ({ message, user }) => {
    setMessages((messages) => [...messages, { message, user, type: "user" }]);
  };

  const sendTyping = () => {
    socket.emit("typing", { user: loggedUser.username, room });
  };

  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("received message", message);
      receiveMessage(message);
    });

    socket.on("user_joined", ({ users, user: joinedUser }) => {
      console.log("user joined", joinedUser);
      setMessages((messages) => [
        ...messages,
        {
          message: `${joinedUser} joined the room`,
          user: { username: "admin_bot", admin: "CWM Bot" },
          type: "bot",
        },
      ]);
    });

    socket.on("typing", (data) => {
      setTyping(data);
    });

    socket.on("stop_typing", () => {
      console.log("stopped");
      setTyping(false);
    });

    socket.on("user_disconnected", (user) => {
      console.log("user disconnected", user);
      setMessages((messages) => [
        ...messages,
        {
          message: `${user} left the room`,
          user: { username: "admin_bot", admin: "CWM Bot" },
          type: "bot",
        },
      ]);
    });
  }, []);

  useEffect(() => {
    socket.emit("stop_typing");
    setTyping(false);
  }, [debounceTyping]);

  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2 sticky top-0 self-stretch bg-[#1e1e1e] overflow-hidden'>
        Chat
      </h2>
      <div className='chat-section w-full overflow-hidden'>
        <div className='messages-container p-2 overflow-auto h-[696px]'>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message.message}
              time={moment().format("h:mm a")}
              type={message.type}
              isMe={message.user.username === loggedUser.username}
              senderName={message.user.name}
            />
          ))}
        </div>
        <form
          onSubmit={(e) => {
            sendMessage(e);
          }}>
          <span
            className={`text-xs px-2 py-1 h-[25px] flex items-center bg-black/20 ${
              typing ? "opacity-1" : "opacity-0"
            }`}>
            {typing && (
              <span className='animate-pulse'>{typing?.user} is typing...</span>
            )}
          </span>
          <input
            type='text'
            className='w-full px-3 bg-[#232526] py-3  border-t border-white/5 outline-none'
            placeholder='Enter a message'
            name='message'
            onChange={sendTyping}
            required
          />
        </form>
      </div>
    </div>
  );
};

export default ChatConversation;
