import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { GetUserContext } from "../../Store/user-store";
import NotFound from "../404NotFound/NotFound";
import Login from "../Login/Login";
import UserProfile from "../../Components/UserProfile/UserProfile";
import UpdateForm from "../../Components/UpdateForm/UpdateForm";
import useGetUser from "../../Hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import JwtService from "../../apiServices/authService";
// import useFileUpload from "../../Hooks/useFileUpload";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState({});

  const [userExist, setUserExist] = useState();
  const navigate = useNavigate();
  const { currentUserId, loading } = useGetUser();

  useEffect(() => {
    const isAuth = localStorage.getItem("auth") !== null;
    // console.log(isAuth);
    console.log(currentUser.id);

    if (isAuth && currentUser) {
      (async () => {
        JwtService.getCurrentUser().then((res) => {
          console.log(res.currentUser);
          setCurrentUser(res.currentUser);
        });
      })();
      setUserExist(true);
    } else if (!currentUser) {
      setTimeout(() => {
        navigate("/login");
      });
    } else {
      setUserExist(false);
      // setTimeout(() => {
      //   navigate("/profile/notfound");
      // });
    }
  }, []);
  return (
    <>
      {currentUser && (
        <>
          <div className="overflow-hidden">
            <Navbar />
            <div class="my-4 max-w-screen-lg border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto mt-[2rem]  overflow-hidden">
              {/* <UserProfile currentUser={currentUser} /> */}
              <UpdateForm currentUser={currentUser} />
            </div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
