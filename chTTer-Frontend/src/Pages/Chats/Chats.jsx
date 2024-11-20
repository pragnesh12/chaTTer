import React, { useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import ChatSideBar from "../../Components/Chats/ChatSideBar";
import ChattingBar from "../../Components/Chats/ChattingBar";

const Chats = () => {
  return (
    <>
      <Navbar />
      <div className="flex overflow-hidden">
        <ChatSideBar />
        <div className="hidden md:block">
          {" "}
          {/* Hidden below md */}
          <ChattingBar />
        </div>
      </div>
    </>
  );
};

export default Chats;
