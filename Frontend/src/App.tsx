
import Dashboard from "./pages/Dashboard";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import SharedBrain from "./components/SharedBrain";
import { Toaster } from "react-hot-toast";

function App() {
  return (
     <BrowserRouter>
     <Toaster/>
      <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/signin" element={<SignIn/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/brain/:hash" element={<SharedBrain />} />

      </Routes>
     </BrowserRouter>
  );
}

export default App;
