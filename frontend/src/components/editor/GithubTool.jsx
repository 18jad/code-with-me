import Icon from "assets/icons/icons";
import { Octokit } from "octokit";
import { useEffect, useRef, useState } from "react";
import OauthPopup from "react-oauth-popup";
import { useSelector } from "react-redux";
import { notificationToaster } from "utils/notificationToaster";
import { tw } from "utils/TailwindComponent";
import { EditorController } from "views/Editor/editorController";

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
  const [githubLogin, setGithubLogin] = useState(false);

  const [accessToken, setAccessToken] = useState(null);

  const [authUser, setAuthUser] = useState(null);

  const [repoName, setRepoName] = useState("");

  const githubForm = useRef(null);

  const { project } = useSelector((state) => state.project);
  console.log(project);

  let octokit = new Octokit({ auth: accessToken });

  const editorController = new EditorController(octokit);

  const onCode = (code) => {
    editorController
      .githubAccessToken(code)
      .then((res) => {
        setAccessToken(res.access_token);
        notificationToaster("Successfully connected");
        setTimeout(() => {
          setGithubLogin(true);
        }, 300);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (accessToken) {
      editorController.githubUserData(accessToken).then((data) => {
        console.log(data);
        setAuthUser(data);
      });
    }
  }, [accessToken]);

  console.log(authUser);

  const onClose = () => {};

  return (
    <div className={className}>
      <h2 className='p-4 border-b-2 border-[#232526] mb-2'>Github</h2>
      <div className='content flex flex-col items-center mt-5 px-2 gap-4 border-b-2 border-[#232526] pb-5'>
        {/* TODO: Change to github connect status */}
        {!githubLogin ? (
          <OauthPopup
            url={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=repo`}
            onCode={onCode}
            onClose={onClose}>
            <button
              className='py-1 bg-black/20 rounded border border-white/10 hover:bg-black/40 transition duration-200 flex items-center justify-center text-white gap-2 w-[230px]'
              onClick={(e) => {
                e.target.innerHTML = `
              <div class=' flex justify-center items-center'>
                  <div class='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                </div>`;
              }}>
              <Icon i='github' height={18} className='mb-[2px]' />
              <span>Connect to github</span>
            </button>
          </OauthPopup>
        ) : (
          <form
            className='inputs-wrapper flex flex-col items-center w-full gap-3'
            onSubmit={(e) => {
              editorController
                .pushCodeToGithub(e, project.title, authUser, accessToken)
                .then((res) => {
                  notificationToaster("Code pushed successfully");
                  githubForm.current.innerHTML = `
                    <p>Code successfully pushed</p>
                    <a href='https://github.com/${authUser.login}/${repoName}' target='_blank' rel='noreferrer' class='text-blue-500 text-xs'>View on github</a>
                    <img src="https://i.pinimg.com/originals/2d/8e/e8/2d8ee815146390d567706f2c7b5c2916.gif" style="width: 200px; border-radius: 7px;" />
                  `;
                })
                .catch((err) => console.log(err));
            }}
            ref={githubForm}>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <div className='flex items-center justify-start w-[110%] -mt-2 px-3 pb-3 mb-1 border-b-2  border-[#232526] gap-2'>
                <img
                  src={`${authUser?.avatar_url}`}
                  alt='avatar'
                  className='w-8 h-8 rounded-full'
                />
                <span className='text-white'>{authUser?.login}</span>
              </div>
              <label
                htmlFor='repo-name'
                className='text-left self-start ml-3 text-sm'>
                Repository name
              </label>
              <Input
                placeholder='Enter a name'
                id='repo-name'
                onChange={(e) => setRepoName(e.target.value)}
                name='repository_name'
              />
            </div>
            <div className='input flex flex-col gap-1 w-full items-center text-left'>
              <label
                htmlFor='repo-description'
                className='text-left self-start ml-3 text-sm'>
                Commit message
              </label>
              <textarea
                placeholder='Enter a commit message'
                name='commit_message'
                className='
                  bg-white/10 border shadow-sm px-2 py-1 placeholder-gray-400 border-gray-500 focus:border-gray-800  focus:ring-2 focus:bg-black/10 focus:ring-gray-500 text-sm outline-none rounded-sm transition duration-150 text-white h-[130px] resize-none w-11/12
              '
                id='repo-description'></textarea>
            </div>
            <button className='px-2 py-1 border border-white/10 rounded text-sm hover:bg-white/10 transition duration-200 shadow'>
              Create and push
            </button>
          </form>
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
              <span className='font-bold'>Choose</span> a commit message
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
