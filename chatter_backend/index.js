const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./src/Config/database.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.1.4:3000",
      "https://chtterforeveryone.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Configure PORT
const PORT = process.env.PORT || 1156;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.4:3000",
      "https://chtterforeveryone.netlify.app",
    ],
    credentials: true,
  })
);

// Static file serving
app.use("/api/v1/users/public", express.static("public/users"));

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Import user routes
const userRoute = require("./src/Routes/UserRoutes/UserRoutes.js");
const conversationRoute = require("./src/Routes/ChatRoutes/ConversationRoute.js");
app.use("/api/v1", userRoute);
app.use("/api/v1", conversationRoute);

// Import and use Socket.IO handler
const socketHandler = require("./src/Socket/socketHandler.js");
socketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
                        