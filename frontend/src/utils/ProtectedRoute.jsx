import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ condition, access, redirect }) => {
  return !condition ? ( // Check is the condition valid and true?!
    <Navigate to={redirect} replace /> // Navigate to unprotected route if no
  ) : access ? ( // check if access is passed in props
    access // if yes redirect to access page
  ) : (
    <Outlet /> // else redirect to outlet
  );
};

export { ProtectedRoute };
