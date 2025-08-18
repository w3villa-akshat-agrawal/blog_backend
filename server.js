const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const userRoutes = require('./src/routes/userRoutes.js');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes.js')
const paymentRoutes = require('./src/routes/paymentRoute.js')
const otpRoutes = require('./src/routes/otpRoutes.js')
const social = require('./src/routes/userSocial.js');
const userBlog = require('./src/routes/blogRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js')
const uploadRoute = require("./src/routes/imageUpload.js");
const userBlogComment = require('./src/routes/comment.js');
const googleLogin = require('./src/routes/auth.js');
const connectDB = require('./config/mongo_connection.js');
const errorHandle = require('./src/middleware/errorHandling.js');
const db = require('./src/models');
const chatHandler = require('./src/socket/chat.js');
// cron job
require("./src/cornJobs/downgradeUsers.js")
// Load environment variables
dotenv.config();
require('./utils/passportconfig.js');
require('./config/mySql_connection.js');

// Create Express app
const app = express();

// Create HTTP server (required for socket.io)
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import and apply chat socket logic
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  chatHandler(io,socket) // pass io and socket instance
});


// cors
app.use(
  cors({
    origin: ["https://blog-app-frontend-six-iota.vercel.app","http://localhost:5173"], // <-- your deployed frontend
    credentials: true, // allow cookies
  })
);
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from blog app backend");
});
app.use("/api/v1", googleLogin);
app.use("/api/v1", userRoutes);
app.use("/api/v1/blog", userBlog);
app.use("/api/v1/blogComment", userBlogComment);
app.use("/app/v1/social", social);
app.use("/api/v1/admin",adminRoutes)
app.use("/api/v1/userPlan",subscriptionRoutes)
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);
app.use(errorHandle);

app.use("/api/upload", uploadRoute);
// Start server only after DBs are connected
const PORT = process.env.PORT || 3010
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Sequelize DB connection successful');

    await connectDB();
    console.log('MongoDB connection successful');

    server.listen(PORT, () => {
      console.log(`Server + Socket.IO running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

// Optional: export io if needed elsewhere
module.exports = { io };
