import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "utils/ProtectedRoute";
import Authentication from "views/Authentication";
import Home from "views/Home";

function App() {
  return (
    <Routes>
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
  );
}

export default App;
