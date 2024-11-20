const express = require("express");
const sendMessage = require("../../Controllers/ConversationController/SendMessage.js");
const getConversationBetweenUsers = require("../../Controllers/ConversationController/getConversationBetweenUsers.js");
const getLatestMessage = require("../../Controllers/ConversationController/getLatestMessage.js");
const getUnseenMessages = require("../../Controllers/ConversationController/getUnseenMessages.js");
const conversationRouter = express.Router();

conversationRouter.post("/chat", sendMessage);
conversationRouter.post("/getmessages", getConversationBetweenUsers);
conversationRouter.post("/getlatestmessage", getLatestMessage);
conversationRouter.post("/getUnseenMessages", getUnseenMessages);

module.exports = conversationRouter;
