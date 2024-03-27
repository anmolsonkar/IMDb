import Home from './components/Home'
import Login from "./components/Login";
import SignUp from "./components/Signup";
import { useAuthContext } from './context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 300,
  easing: "ease-in-quad",

});

const App = () => {
  const { authUser, user } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* <Route path='/' element={authUser ? <Home user={user && user} /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
        <Route path='/*' element={authUser ? <Home /> : <Navigate to={"/login"} />} /> */}
        <Route path='/*' element={<Home />} />

      </Routes>
    </div>

  );
}

export default App;




