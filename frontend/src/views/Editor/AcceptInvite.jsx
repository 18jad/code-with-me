import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import { EditorController } from "./editorController";

const AcceptInvite = () => {
  // Get the invite tokne from the URL param
  const { id } = useParams();

  // Editor controller, to use allowUser method, for allowing users into a project
  const editorController = new EditorController();

  const [error, setError] = useState(null);

  useEffect(() => {
    editorController
      .allowUser(id) // allow user
      .then((result) => {
        if (result.success) {
          setTimeout(() => {
            window.location.href = `/project/${result.title}`; // redirect to project page
          }, 2500);
        }
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message;
        errorMessage.indexOf("Invalid") !== -1 && setError("invalid"); // check if error is for invalid link or for already allowed
        if (errorMessage.indexOf("already") !== -1) {
          setError("already");
          setTimeout(() => {
            window.location.href = `/project/${error?.response?.data?.project?.title}`; // redirect user to project page if he was already a member
          }, 2500);
        }
      });
  }, []);

  return (
    <div className='h-screen w-full flex items-center justify-center text-white flex-col gap-2'>
      {error === "already" ? (
        <>
          <div className='text-3xl'>You have already accepted this invite</div>
          <span className='animate-pulse'>
            Redirecting you to project page...
          </span>
        </>
      ) : error === "invalid" ? (
        <NotFound />
      ) : (
        <>
          <p className='text-6xl'>Invitation accepted</p>
          <span className='animate-pulse'>
            Redirecting you to project page...
          </span>
        </>
      )}
    </div>
  );
};

export default AcceptInvite;
