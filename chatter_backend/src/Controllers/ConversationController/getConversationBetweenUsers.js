const db = require("../../../models/index.js");
const { Op } = require("sequelize"); // Import Sequelize operators for OR conditions
const jwtDecoder = require("../../Helper/jwtDecoder.js");

// Example with 'Messages' model
const getConversationBetweenUsers = async (req, res) => {
  const data = await req.body;
  console.log("======>", data);
  const userData = await jwtDecoder(req);
  const receiverId = userData.id;

  try {
    const conversation = await db.Conversations.findAll({
      where: {
        [Op.or]: [
          // Case 1: Sender sends to receiver
          { sender_id: data.senderId, receiver_id: receiverId },
          // Case 2: Receiver sends to sender (opposite direction)
          { sender_id: receiverId, receiver_id: data.senderId },
        ],
      },
    });

    // const recentConversation = await db.Conversations.findOne({
    //   where: {
    //     [Op.or]: [
    //       // Case 1: Sender sends to receiver
    //       { sender_id: data.senderId, receiver_id: receiverId },
    //       // Case 2: Receiver sends to sender (opposite direction)
    //       { sender_id: receiverId, receiver_id: data.senderId },
    //     ],
    //   },
    //   order: [["createdAt", "DESC"]],
    // });

    if (conversation) {
      // const localCreatedAt = new Date(
      //   recentConversation.createdAt
      // ).toLocaleString();
      return res.status(200).json({
        success: true,
        message: "Conversation Found Successfully",
        // recentConversation: {
        //   ...recentConversation.toJSON(), // Convert Sequelize instance to plain object
        //   createdAt: localCreatedAt, // Add formatted date to the response
        // },
        conversation,
      });
    } else {
      console.log("No conversation found between the users.");
      return res.status(404).json({
        success: false,
        message: "No conversation found between the users.",
      });
    }
  } catch (error) {
    console.error("Error fetching conversation: ", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversation",
      error: error.message,
    });
  }
};

module.exports = getConversationBetweenUsers;
