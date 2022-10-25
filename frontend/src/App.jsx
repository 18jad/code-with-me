import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "utils/ProtectedRoute";
import routes from "./routes";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      {/* Key is passed to help animate presence know what component mounted */}
      <Routes location={location} key={location.pathname}>
        {routes.map((route, index) => {
          const { path, component, isProtected, condition, access, redirect } =
            route;
          return !isProtected ? (
            <Route key={index} path={path} element={component}></Route>
          ) : (
            <Route
              path={path}
              key={index}
              element={
                <ProtectedRoute
                  condition={condition}
                  redirect={redirect}
                  access={access}
                />
              }></Route>
          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
