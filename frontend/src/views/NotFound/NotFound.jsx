import ErrorTemplate from "./ErrorTemplate";

const NotFound = () => {
  return <ErrorTemplate httpCode={404} message='Page not found' />;
};

export default NotFound;
