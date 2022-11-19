import ChatConversation from "components/ChatConversation";
import FileStructure from "./FileStructure";
import GithubTool from "./GithubTool";
import VoiceChat from "./VoiceChat";

const swapContent = (content, compare) => {
  return content === compare
    ? "opacity-1"
    : "opacity-0 h-0 w-0 -z-50 pointer-events-none sticky top-0 self-stretch";
};

const SidebarContent = ({ content, socket, fileStructure }) => {
  // Here we are hiding the element under the current active element using swapContent function
  // Instead of just rendering another component
  // This is to prevent the sidebar content from being re-rendered and losing old content/state

  return (
    <>
      <FileStructure
        className={swapContent(content, "files")}
        fileStructure={fileStructure}
      />
      <GithubTool className={swapContent(content, "github")} />
      <ChatConversation
        className={swapContent(content, "chat")}
        socket={socket}
      />
      <VoiceChat className={swapContent(content, "voice")} />
    </>
  );
};

export default SidebarContent;
