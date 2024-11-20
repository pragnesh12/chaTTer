import fetch from "../interceptor/fetchInterceptor.js";

const chatService = {};

chatService.sendMessage = function (senderId, latestMessage) {
  const isAuthToken = localStorage.getItem("auth");
  console.log("IS AUTH : ", typeof isAuthToken);
  console.log("Inside Without Sending Message");

  console.log("dataaaa ======> ", senderId, latestMessage);
  return fetch({
    url: `/chat`,
    method: "post",
    headers: {
      Authorization: `Bearer ${isAuthToken}`,
    },
    data: { senderId, latestMessage },
  });
};

chatService.getConversationBetweenUsers = function (senderId) {
  const isAuthToken = localStorage.getItem("auth");
  console.log("IS AUTH : ", typeof isAuthToken);
  console.log("Inside Without Fetching Messages");

  console.log("dataaaa ======> ", senderId);
  return fetch({
    url: `/getmessages`,
    method: "post",
    headers: {
      Authorization: `Bearer ${isAuthToken}`,
    },
    data: { senderId },
  });
};

chatService.getlatestmessage = function (senderId) {
  const isAuthToken = localStorage.getItem("auth");
  console.log("IS AUTH : ", typeof isAuthToken);
  console.log("Inside Without Fetching ChatDetailes : ", senderId);
  return fetch({
    url: `/getlatestmessage`,
    method: "post",
    headers: {
      Authorization: `Bearer ${isAuthToken}`,
    },
    data: { senderId },
  });
};

export default chatService;
