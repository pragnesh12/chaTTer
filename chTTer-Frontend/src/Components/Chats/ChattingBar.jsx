import React, { useContext, useEffect, useState, useRef } from "react";
import JwtService from "../../apiServices/authService";
import { io } from "socket.io-client";
import { GetUserContext } from "../../Store/user-store";
import chatService from "../../apiServices/chatService";
import { toast } from "react-toastify";
import Message from "./Message";

const ChattingBar = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loginUser, setLoginUser] = useState();
  const [input, setInput] = useState({ message: "" });
  const { selectedChat } = useContext(GetUserContext);
  const { setIsOnline } = useContext(GetUserContext);
  const [room, setRoom] = useState();
  const [latestMessages, setLatestMessages] = useState([]);
  const [FetchReceiver, setFetchReceiver] = useState();

  // Establish socket connection
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:1156/", {
      auth: { token: localStorage.getItem("auth") },
    });

    socket.current.on("connect", () => {
      console.log(
        "Socket.io Connected Successfully. Socket Id:",
        socket.current.id
      );
      setIsOnline(true);
    });

    socket.current.on("Receive-Message", ({ message, from }) => {
      console.log("Received message from sender:", message);
      if (message) {
        console.log("------------->", message);
        setLatestMessages((prevMessages) => [
          ...prevMessages,
          { message, from },
        ]);
      }
    });

    // Cleanup socket on unmount
    socket.current.on("disconnect", () => {
      console.log(
        "Socket.io Disconnected Successfully. Socket Id:",
        socket.current.id
      );
      setIsOnline(false);
    });
    return () => socket.current.disconnect();
  }, [room, currentUser.id]);

  // Fetch current user and chat participants
  useEffect(() => {
    (async () => {
      const res = await JwtService.getCurrentUser(selectedChat);

      if (!selectedChat) {
        setCurrentUser(res.currentUser);
        setLoginUser(res.currentUser);
        setUsers(res.allUsers);
      } else {
        setCurrentUser(res.user);
        setFetchReceiver(res.user.profile_picture);
      }

      await chatService
        .getConversationBetweenUsers(selectedChat)
        .then((res) => {
          console.log("PPPPP=>", res.conversation);
          setLatestMessages(res.conversation);
          console.log("curr : ", currentUser);
        });
    })();
  }, [selectedChat]);

  // Send message handler
  const handleOnClick = async () => {
    if (!selectedChat) toast.warning("Please Select The Chat First");

    if (!input.message) return; // Prevent empty message send

    // Emit the message to the socket
    socket.current.emit("Send-Message", {
      message: input.message,
      to: room || currentUser.id,
    });

    // Update message list immediately for the sender
    setLatestMessages([
      ...latestMessages,
      { message: input.message, from: "You" },
    ]);

    await chatService.sendMessage(currentUser.id, input.message);
    // Clear input field after sending
    setInput({ message: "" });
  };

  // Filter out current user from the list of users
  const filteredUsers = users.filter((user) => user.id !== currentUser.id);

  //   return (
  //     <div className="flex-1">
  //       <header className="bg-white p-4 text-gray-700 border-b border-gray-300">
  //         <h1 className="text-2xl font-semibold">
  //           {!selectedChat ? "Please Select Chat" : currentUser.first_name}
  //         </h1>
  //       </header>

  //       <div className="h-screen overflow-y-auto p-4 pb-36">
  // {Array.isArray(latestMessages) && latestMessages.length > 0 ? (
  //   latestMessages.map((msg, index) => {
  //     if (!msg) {
  //       console.warn(`Message at index ${index} is undefined`);
  //       return null;
  //     }

  //     const userAvatar =
  //       (loginUser && loginUser.id === msg.receiver_id) ||
  //       msg.from === "You"
  //         ? loginUser.profile_picture
  //         : currentUser?.profile_picture || "default-image.png";

  //     return (
  //       <div
  //         key={index}
  //         className={`flex mb-4 cursor-pointer ${
  //           loginUser &&
  //           (loginUser.id == msg.receiver_id || msg.from === "You")
  //             ? "justify-end"
  //             : ""
  //         }`}
  //       >
  //         <div
  //           className={`flex max-w-96 ${
  //             loginUser &&
  //             (loginUser.id == msg.receiver_id || msg.from === "You")
  //               ? "bg-indigo-500 text-white"
  //               : "bg-white"
  //           } rounded-lg p-3 gap-3`}
  //         >
  //           <p>
  //             {msg.message ||
  //               msg.latest_messages ||
  //               "No message available"}
  //           </p>
  //         </div>
  //         <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
  //           <img
  //             src={
  //               loginUser.id == msg.receiver_id || msg.from === "You"
  //                 ? loginUser.profile_picture
  //                 : currentUser?.profile_picture
  //             }
  //             alt="User Avatar"
  //             className="w-8 h-8 rounded-full"
  //             onError={(event) => {
  //               event.target.src = "default-image.png";
  //             }}
  //           />
  //         </div>
  //       </div>
  //     );
  //   })
  // ) : (
  //   <div>Please Select Chat From SideBar</div>
  // )}
  //       </div>

  // <footer className="bg-white border-t border-gray-300 p-2 md:p-4 fixed bottom-0 w-2/4 md:w-3/4">
  //   <div className="flex flex-col md:flex-row items-center">
  //     <input
  //       type="text"
  //       placeholder="Type a message..."
  //       className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500 mb-2 md:mb-0"
  //       value={input.message}
  //       onChange={(e) => setInput({ message: e.target.value })}
  //     />
  //     <button
  //       className={`bg-indigo-500 text-white px-4 py-2 rounded-md ml-0 md:ml-2 w-full md:w-auto ${
  //         !selectedChat && "cursor-not-allowed"
  //       }`}
  //       onClick={handleOnClick}
  //       type="submit"
  //     >
  //       Send
  //     </button>
  //   </div>
  // </footer>;
  //     </div>
  //   );
  // };

  // export default ChattingBar;

  return (
    <div className="border border-l-gray-500">
      <div className="md:w-[68rem] border flex flex-col md:h-[40rem] w-0">
        <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
          <div className="flex items-center">
            <div>
              <img
                className="w-10 h-10 rounded-full"
                src={`${
                  currentUser.profile_picture
                    ? currentUser.profile_picture
                    : "default-image.png"
                } `}
                alt={currentUser.first_name}
                onError={(event) => {
                  event.target.src = "default-image.png";
                }}
              />
            </div>
            <div className={`ml-4 `}>
              <p className="text-grey-darkest">
                {" "}
                {!selectedChat
                  ? currentUser.first_name + "  " + `(You)`
                  : currentUser.first_name}
              </p>
              <p className="text-grey-darker text-xs mt-1">
                Andrés, Tom, Harrison, Arnold, Sylvester
              </p>
            </div>
          </div>

          <div className="flex">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#263238"
                  fillOpacity=".5"
                  d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                ></path>
              </svg>
            </div>
            <div className="ml-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#263238"
                  fillOpacity=".5"
                  d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                ></path>
              </svg>
            </div>
            <div className="ml-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"    
                height="24"
              >
                <path
                  fill="#263238"
                  fillOpacity=".6"
                  d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto"
          style={{ backgroundColor: "#DAD3CC" }}
        >
          <div className="py-2 px-3">
            <div className="flex justify-center mb-2">
              <div
                className="rounded py-2 px-4"
                style={{ backgroundColor: "#DDECF2" }}
              >
                <p className="text-sm uppercase">February 20, 2018</p>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div
                className="rounded py-2 px-4"
                style={{ backgroundColor: "#FCF4CB" }}
              >
                <p className="text-xs">
                Messages to this chat and calls are now secured with
                  end-to-end encryption. Tap for more info.
                </p>
              </div>
            </div>

            <Message
              latestMessages={latestMessages}
              loginUser={loginUser}
              currentUser={currentUser}
            />
          </div>
        </div>
        <footer className="bg-white border-t border-gray-300 p-2 md:p-4 fixed bottom-0 w-full md:w-[68rem] ">
          <div className="flex flex-col md:flex-row items-center">
            {/* Input field */}
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500 mb-2 md:mb-0"
              value={input.message}
              onChange={(e) => setInput({ message: e.target.value })}
            />

            {/* Send button */}
            <button
              className={`bg-indigo-500 text-white px-4 py-2 rounded-md w-full md:w-auto ml-0 md:ml-2 ${
                !selectedChat && "cursor-not-allowed"
              }`}
              onClick={handleOnClick}
              type="submit"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChattingBar;
