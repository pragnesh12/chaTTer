import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetUserContext } from "../../Store/user-store";

const Navbar = () => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState();

  const { currentUser } = useContext(GetUserContext);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser");
    toast("Logout successfully");
    setTimeout(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("currentUser");
    if (isLogin) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, []);

  return (
    <>
      {/* <nav
        id="header"
        className="w-full z-30 top-10 py-1 bg-white shadow-lg border-b border-blue-400"
      >
        <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
          <label for="menu-toggle" className="cursor-pointer md:hidden block">
            <svg
              className="fill-current text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <title>menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </label>
          <input className="hidden" type="checkbox" id="menu-toggle" />

          <div
            className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"
            id="menu"
          >
            <nav>
              <ul className="md:flex items-center justify-between text-base text-gray-800 pt-4 md:pt-0">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-blue-800 hover:text-blue-500 dark:text-blue-800 dark:hover:text-blue-400 lg:mx-6 underline"
                        : "text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 lg:mx-6"
                    }
                    to="/home"
                  >
                    Home
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <div
            className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
            id="nav-content"
          >
            <div className="auth flex items-center w-full md:w-full">
              <NavLink to="/">
                <button className="bg-red-600 text-gray-200  p-2 rounded  hover:bg-red-500 hover:text-gray-100">
                  Logout
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav> */}
      <nav class="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto ">
        <div class="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
          <div class="text-indigo-500 md:order-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <div class="text-gray-500 order-3 w-full md:w-auto md:order-2">
            <ul class="flex font-semibold justify-between">
              <li class="md:px-4 md:py-2 text-indigo-500">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-indigo-800 hover:text-indigo-800 dark:text-indigo-800 dark:hover:text-indigo-800 underline text-xl font-bold"
                      : "text-gray-700  text-xl hover:text-indigo-500 dark:text-gray-800 dark:hover:text-indigo-800 hover:underline"
                  }
                  to="/home"
                >
                  Home
                </NavLink>
              </li>
              {isShow && (
                <li class="md:px-4 md:py-2 hover:text-indigo-400">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-indigo-800 hover:text-indigo-800 dark:text-indigo-800 dark:hover:text-indigo-800 underline text-xl font-bold"
                        : "text-gray-700  text-xl hover:text-indigo-500 dark:text-gray-800 dark:hover:text-indigo-800 hover:underline"
                    }
                    to="/profile"
                  >
                    Profile
                  </NavLink>
                </li>
              )}
              {isShow && (
                <li class="md:px-4 md:py-2 text-indigo-500">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-indigo-800 hover:text-indigo-800 dark:text-indigo-800 dark:hover:text-indigo-800 underline text-xl font-bold"
                        : "text-gray-700  text-xl hover:text-indigo-500 dark:text-gray-800 dark:hover:text-indigo-800 hover:underline"
                    }
                    to="/chats"
                  >
                    Chat
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
          <div class="order-2 md:order-3">
            {isShow ? (
              <NavLink to="/home">
                <button
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-gray-50 rounded-xl flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </NavLink>
            ) : (
              <NavLink to="/login">
                <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-gray-50 rounded-xl flex items-center gap-2">
                  <span>Login</span>
                </button>
              </NavLink>
            )}
            {/* {isShow && (
              <NavLink to="/profile">
                <div class="overflow-hidden lg:ml-[8rem] lg:mt-[-2.5rem] md:ml-[8rem] md:mt-[-2.5rem] ml-[8rem] mt-[-2.5rem]">
                  <img
                    className="inline-block h-11 w-11 rounded-full ring-3 ring-gray-100 "
                    src={`${
                      currentUser.profile_picture
                        ? currentUser.profile_picture
                        : "default-image.png"
                    } `}
                    onError={(event) => {
                      event.target.src = "default-image.png";
                    }}
                  />
                </div>
              </NavLink>
            )} */}
          </div>
        </div>
      </nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;
