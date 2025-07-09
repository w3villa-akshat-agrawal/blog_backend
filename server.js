const express = require('express');
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./src/routes/userRoutes.js');
const social = require ('./src/routes/userSocial.js')
const userBlog = require("./src/routes/blogRoutes.js");
const userBlogComment = require("./src/routes/comment.js");
const googleLogin = require("./src/routes/auth.js");
const connectDB = require('./config/mongo_connection.js');
const cookieParser = require('cookie-parser');
const errorHandle = require("./src/middleware/errorHandling.js");
require('dotenv').config();
require('./utils/passportconfig.js');
require('./config/mySql_connection.js');
const db = require('./src/models');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello from blog app");
});

app.use("/api/v1", googleLogin);
app.use("/api/v1", userRoutes);
app.use("/api/v1/blog", userBlog);
app.use("/api/v1/blogComment", userBlogComment);
app.use("/app/v1/social",social)
app.use(errorHandle);

const PORT = process.env.PORT || 3000;

// ✅ Use async function to wait for all DBs before starting
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Sequelize CLI DB connection successful');

    await connectDB(); // MongoDB connect
    console.log('✅ MongoDB connection successful');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1); // Force exit if DB fails
  }
};

startServer();
