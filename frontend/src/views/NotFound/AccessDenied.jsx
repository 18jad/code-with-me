import ErrorTemplate from "./ErrorTemplate";

const AccessDenied = () => {
  return <ErrorTemplate httpCode={403} message='Access denied' />;
};

export default AccessDenied;
