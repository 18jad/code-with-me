import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "utils/ProtectedRoute";
import Authentication from "views/Authentication";
import Home from "views/Home";

function App() {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      {/* key is passed to help animate presence know which child is mounting */}
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Home />} />
        <Route
          path='/auth'
          element={
            <ProtectedRoute
              condition={true}
              redirect=''
              access={<Authentication />}
            />
          }></Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
