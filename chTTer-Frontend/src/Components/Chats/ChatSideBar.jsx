import React, { useContext, useEffect, useRef, useState } from "react";
import JwtService from "../../apiServices/authService";
import { API_IMAGE_URL } from "../../config/AppConfig";
import { io } from "socket.io-client";
import { GetUserContext } from "../../Store/user-store";
import chatService from "../../apiServices/chatService";

const ChatSideBar = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]); // To store the list of online users
  const [recentMessages, setRecentMessages] = useState();
  const { setSelectedChat } = useContext(GetUserContext);
  const { selectedChat } = useContext(GetUserContext);

  const socket = useRef(null);

  // Socket connection and handle IsOnline event
  useEffect(() => {
    socket.current = io("http://localhost:1156/", {
      auth: { token: localStorage.getItem("auth") },
    });

    socket.current.on("connect", () => {
      // Listen for the 'IsOnline' event and update the online users list
      socket.current.on("isOnline", (users) => {
        console.log("Users ------------ > ", users);
        setOnlineUsers((prevUsers) => [...prevUsers, users]); // Store online users' IDs
      });
    });

    // Listen for 'userDisconnected' event to remove users
    socket.current.on("userDisconnected", (userId) => {
      console.log("User Disconnected ID:", userId);
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Fetch all users and the current user
  useEffect(() => {
    (async () => {
      const res = await JwtService.getCurrentUser();
      console.log("res.allUsers", res.allUsers);
      console.log("res.data.user", res.currentUser);
      setCurrentUser(res.currentUser);
      setUsers(res.allUsers);
    })();
  }, []);

  // This useEffect For Retreving Recent Messages from DB
  useEffect(() => {
    // Fetch Conversation Details
    (async () => {
      // Check if selectedChat is not null
      if (selectedChat) {
        try {
          const res = await chatService.getlatestmessage(selectedChat);
          console.log("lmmmmmmmmmmmm =>", res);

          // Get the last message from the conversation
          const lastMessage = res.latestMessage.latest_messages;

          // Set the last message as recentMessages
          setRecentMessages(lastMessage);
          console.log("Latest Message:", lastMessage);
        } catch (error) {
          console.error("Error fetching latest message:", error);
        }
      } else {
        console.log("selectedChat is null, skipping fetch.");
      }
    })();
  }, [selectedChat]); // Add selectedChat as a dependency

  // Filter out the current user from the list of users
  const filteredUsers = users.filter((user) => user.id !== currentUser.id);

  const handleOnClick = async (id) => {
    (await id)
      ? setSelectedChat(id)
      : setSelectedChat("Please Select The Chat");
  };

  //   return (
  //     <div className="w-1/1 md:w-1/4 bg-white border-r border-gray-300">
  //       <header className="p-4 border-b border-gray-300 flex justify-between items-center text-gray-800">
  //         <h1 className="text-xl md:text-2xl font-semibold">Chats</h1>
  //         <div className="relative"></div>
  //       </header>

  //       <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
  //         {filteredUsers.map((val, key) => (
  //           <div
  //             className={`flex items-center mb-4 cursor-pointer hover:bg-gray-100 ${
  //               selectedChat && selectedChat === val.id && `bg-gray-100`
  //             } p-2 rounded-md`}
  //             key={key}
  //             onClick={() => {
  //               handleOnClick(val.id);
  //             }}
  //           >
  //             <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full mr-3">
  //               <img
  //                 src={`${
  //                   val.profile_picture
  //                     ? `${API_IMAGE_URL}${val.profile_picture}`
  //                     : "default-image.png"
  //                 } `}
  //                 alt="User Avatar"
  //                 className="w-full h-full rounded-full"
  //               />
  //               {onlineUsers.includes(val.id) && ( // Check if the user is online
  // <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
  //               )}
  //             </div>
  //             <div className="flex-1">
  //               <h2 className="text-lg font-semibold">{val.first_name}</h2>
  //               <p className="text-gray-600">{recentMessages}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // export default ChatSideBar;

  return (
    <div className="border border-r-gray-500  ">
      <div class="md:w-[27rem] sm:w-[44rem] w-[30rem]  border flex flex-col ">
        <div class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
          <div>
            <img
              class="w-10 h-10 rounded-full"
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

          <div class="flex">
            <div class="ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#263238"
                  fill-opacity=".6"
                  d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="py-2 px-2 bg-grey-lightest">
          <input
            type="text"
            class="w-full px-2 py-2 text-sm"
            placeholder="Search or start new chat"
          />
        </div>

        <div class="bg-grey-lighter flex-1">
          {filteredUsers.map((val, key) => (
            <div
              className={`px-3 flex items-center bg-grey-light cursor-pointer ${
                selectedChat && selectedChat === val.id && `bg-gray-100`
              }`}
              key={key}
              onClick={() => {
                handleOnClick(val.id);
              }}
            >
              <div>
                <img
                  class="h-12 w-12 rounded-full"
                  src={`${
                    val.profile_picture
                      ? `${API_IMAGE_URL}${val.profile_picture}`
                      : "default-image.png"
                  } `}
                />
              </div>
              <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
                <div class="flex items-bottom justify-between">
                  <p class="text-grey-darkest">{val.first_name}</p>
                  <p className="text-xs text-grey-darkest mr-[10rem] sm:mr-0">
                    12:45 pm
                  </p>
                </div>
                <p class="text-grey-dark mt-1 text-sm flex justify-between">
                  <p className=""> {recentMessages}</p>
                  <p className="w-7 h-7 bg-red-500 rounded-full border-2 border-white text-white text-center content-center">
                    1
                  </p>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
