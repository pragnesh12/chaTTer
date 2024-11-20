const db = require("../../../models/index.js");
const jwtDecoder = require("../../Helper/jwtDecoder.js");

const sendMessage = async (req, res) => {
  console.log("Body Of CHat : ", req.body);
  const data = await req.body;
  const userData = await jwtDecoder(req);
  const receiverId = userData.id;
  try {
    const SenderExist = await db.User.findOne({
      where: {
        id: data.senderId,
      },
    });
    const ReceiverExist = await db.User.findOne({
      where: {
        id: receiverId,
      },
    });

    if (!SenderExist || !ReceiverExist) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    console.log("data : dasdasdas : ", data.senderId);
    console.log("data : dasdasdas : ", receiverId);
    console.log("data : dasdasdas : ", data.latestMessage);
    const Conversation = await db.Conversations.create({
      sender_id: data.senderId,
      receiver_id: receiverId.toString(),
      latest_messages: data.latestMessage,
    });

    return res.status(200).json({
      success: true,
      message: "Message Sended Successfully!",
      Conversation,
    });
  } catch (error) {
    console.log("Error during sending message : ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = sendMessage;
