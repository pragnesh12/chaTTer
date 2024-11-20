import { useReducer, useState } from "react";
import { createContext } from "react";
// import JwtService from "../apiServices/authService";
// import useUpdate from "../hooks/useUpdate";

// export const GetUserContext = createContext({
//   getUsers: [],
//   currentUser: null,
//   setCurrentUserId: () => {},
//   deleteAdmin: () => {},
// });

export const GetUserContext = createContext([]);

const getUserReducer = (currentUsers, action) => {
  switch (action.type) {
    case "NEW_USER":
      return [
        ...currentUsers,
        {
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          email: action.payload.email,
          password: action.payload.password,
        },
      ];
    default:
      return currentUsers;
  }
};

const currentUserReducer = (currentUser, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return action.payload;
    default:
      return currentUser;
  }
};

const GetUserContextProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUser, dispatchCurrentUser] = useReducer(
    currentUserReducer,
    storedUser
  );

  const setCurrentUserId = (userData) => {
    console.log("Current User ID Updated: ", userData);
    const setCurrentUserAction = {
      type: "SET_CURRENT_USER",
      payload: userData,
    };
    dispatchCurrentUser(setCurrentUserAction);
  };

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [getUserId, setGetUserId] = useState();
  const [isOnline,setIsOnline] = useState(false)
  const [notification, setNotification] = useState([]);

  return (
    <GetUserContext.Provider
      value={{
        currentUser,
        setCurrentUserId,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        isOnline,
        setIsOnline,
      }}
    >
      {children}
    </GetUserContext.Provider>
  );
};

export default GetUserContextProvider;
