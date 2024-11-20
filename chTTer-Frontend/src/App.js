import logo from "./logo.svg";
import "./App.css";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import NotFound from "./Pages/404NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile.jsx";
import Redirection from "./Pages/404NotFound/Redirecttion/Redirection";
import GetUserContextProvider from "./Store/user-store.js";
import UserNotFound from "./Pages/Profile/UserNotFound.jsx";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./Components/ResetPassword/ResetPassword.jsx";
import Chats from "./Pages/Chats/Chats.jsx";
import VerifyEmail from "./Pages/Private/VerifyEmail.jsx";

function App() {
  const isAuth = localStorage.getItem("auth");
  return (
    <GetUserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notfound" element={<Redirection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile/notfound" element={<UserNotFound />} />
          <Route path="/verify_email/:token" element={<VerifyEmail />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route path="*" element={isAuth ? <Redirection /> : <NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </GetUserContextProvider>
  );
}

export default App;
