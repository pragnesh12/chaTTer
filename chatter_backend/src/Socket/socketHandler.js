const jwt = require("jsonwebtoken");
const db = require("../../models/index.js");

const usersMap = new Map(); // Store userId -> socketId mapping

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("Socket id:", socket.id);

    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socket.emit("users", users);

    const token = socket.handshake.auth.token;
    const secretKey = process.env.ACCESS_TOKEN;

    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.id;

      // Store the user's socket ID
      usersMap.set(userId, socket.id);
      io.emit("isOnline", userId);
      console.log(`User ${userId} connected with socket.id: ${socket.id}`);

      // Update the user's status to online and set lastSeen
      await db.UserStatus.upsert({
        userId: userId,
        isOnline: true,
        lastSeen: new Date(),
      });

      // Handle Send-Message event
      socket.on("Send-Message", ({ message, to }) => {
        const receiverSocketId = usersMap.get(to); // Get the socket ID for the receiver
        console.log("receiver id: ", receiverSocketId);
        if (receiverSocketId) {
          // Send the message to the receiver
          socket.to(receiverSocketId).emit("Receive-Message", {
            message,
            from: socket.id,
          });

          console.log(`Message sent to ${to}: ${message}`);
        } else {
          console.log(`Receiver with ID ${socket.id} is not connected.`);
        }
      });

      // Handle disconnection
      socket.on("disconnect", async () => {
        usersMap.delete(userId); // Remove the user from the map on disconnect
        console.log(`User ${userId} disconnected.`);

        io.emit("userDisconnected", userId); // Emit the userDisconnected event
        // Update the user's status to offline and set lastSeen
        await db.UserStatus.update(
          {
            isOnline: false,
            lastSeen: new Date(),
          },
          {
            where: { userId: userId },
          }
        );
      });
    } catch (err) {
      console.log("Token verification failed:", err.message);
      socket.emit("unauthorized", { message: "Invalid Token" });
      socket.disconnect();
    }
  });
};

module.exports = socketHandler;
