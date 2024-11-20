const db = require("../../../models/index.js");
const { Op } = require("sequelize"); // Import Sequelize operators for OR conditions
const jwtDecoder = require("../../Helper/jwtDecoder.js");

// Example with 'Messages' model
const getUnseenMessages = async (req, res) => {
  const data = await req.body;
  console.log("======>", data);
  const userData = await jwtDecoder(req);
  const receiverId = userData.id;

  try {
    const getUnseenMessages = await db.Conversations.findAll({
      where: {
        [Op.and]: [
          // Case 1: Sender sends to receiver or receiver sends to sender
          {
            [Op.or]: [
              { sender_id: data.senderId, receiver_id: receiverId },
              { sender_id: receiverId, receiver_id: data.senderId },
            ],
          },
          // Case 2: Message should be marked as "1" for 'showedMessage'
          { showedMessage: "0" },
        ],
      },
    });

    if (getUnseenMessages) {
      return res.status(200).json({
        success: true,
        message: "getUnseenMessages Found Successfully",
        getUnseenMessages,
      });
    } else {
      console.log("No getUnseenMessages found between the users.");
      return res.status(404).json({
        success: false,
        message: "No getUnseenMessages found between the users.",
      });
    }
  } catch (error) {
    console.error("Error fetching getUnseenMessages: ", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching getUnseenMessages",
      error: error.message,
    });
  }
};

module.exports = getUnseenMessages;
