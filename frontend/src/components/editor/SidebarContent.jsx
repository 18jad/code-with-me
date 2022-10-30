import ChatConversation from "components/ChatConversation";
import FileStructure from "./FileStructure";
import GithubTool from "./GithubTool";

const SidebarContent = ({ content }) => {
  // Here we are hiding the element under the current active element
  // Instead of just rendering another component
  // This is to prevent the sidebar content from being re-rendered and losing old content/state

  return (
    <>
      <FileStructure
        className={`${
          content === "fileTree"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        } sticky top-0 self-stretch`}
      />
      <GithubTool
        className={`${
          content === "github"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        } sticky top-0 self-stretch`}
      />
      <ChatConversation
        className={`${
          content === "chat"
            ? "opacity-1"
            : "opacity-0 h-0 w-0 -z-50 pointer-events-none"
        }`}
      />
    </>
  );
};

export default SidebarContent;
