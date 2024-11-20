const db = require("../../../models/index.js");
const { Op, where } = require("sequelize"); // Import Sequelize operators for OR conditions
const jwtDecoder = require("../../Helper/jwtDecoder.js");

const getLatestMessage = async (req, res) => {
  const data = await req.body;
  console.log("======>", data);
  const userData = await jwtDecoder(req);
  const receiverId = userData.id;
  console.log("======>", receiverId);
  try {
    if (data) {
      const latestMessage = await db.Conversations.findOne({
        where: {
          [Op.or]: [
            // Case 1: Sender sends to receiver
            { sender_id: data.senderId, receiver_id: receiverId },
            // Case 2: Receiver sends to sender (opposite direction)
            { sender_id: receiverId, receiver_id: data.senderId },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      // For Updating Message When User Shows All The Messages On Their Side
      // const setSeenMessages = await db.Conversations.update(
      //   { showedMessage: "1" },
      //   {
      //     where: {
      //       [Op.or]: [
      //         // Case 1: Sender sends to receiver
      //         { sender_id: data.senderId, receiver_id: receiverId },
      //         // Case 2: Receiver sends to sender (opposite direction)
      //         { sender_id: receiverId, receiver_id: data.senderId },
      //       ],
      //     },
      //   }
      // );

      if (latestMessage) {
        const localUpdatedAt = new Date(
          latestMessage.createdAt
        ).toLocaleString();

        return res.status(200).json({
          success: true,
          message: "ChatDetailes Found Successfully",
          // ChatDetailes: {
          //   ...ChatDetailes.toJSON(), // Convert Sequelize instance to plain object
          //   createdAt: localUpdatedAt, // Add formatted date to the response
          // },
          latestMessage,
        });
      } else {
        console.log("No ChatDetailes Found For this users.");
        return res.status(404).json({
          success: false,
          message: "No ChatDetailes Found For this users.",
        });
      }
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

module.exports = getLatestMessage;
