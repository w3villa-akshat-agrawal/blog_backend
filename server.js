// require packages and files ........
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const userRoutes = require('./src/routes/userRoutes.js');
const userBlog = require("./src/routes/blogRoutes.js")
const googleLogin = require ("./src/routes/auth.js")
require("./config/mySql_connection.js");
require('dotenv').config();
require('./utils/passportconfig.js'); //Import  Google strategy setup here
const errorHandle = require("./src/middleware/errorHandling.js");
const cookieParser = require('cookie-parser');


// Sequelize DB connection test
const db = require('./src/models');
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize CLI DB connection successful');
  })
  .catch(err => {
    console.error('❌ Sequelize CLI DB connection failed:', err.message);
  });
// -------------------------------------
const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Required for Passport (even without frontend)
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Base route
app.get("/", (req, res) => {
  res.send("Hello from blog app");
});
app.use("/api/v1",googleLogin);
// Routes & Error handler
app.use("/api/v1", userRoutes);
app.use("/api/v1/blog",userBlog)
app.use(errorHandle);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
