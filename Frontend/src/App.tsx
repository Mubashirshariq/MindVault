
import Dashboard from "./pages/Dashboard";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";

function App() {
  return (
     <BrowserRouter>
      <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/signin" element={<SignIn/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
      </Routes>
     </BrowserRouter>
  );
}

export default App;
