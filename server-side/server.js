require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
require('./connection');
const Admin = require('./Routes/admin');
const User = require('./Routes/user');
const userManagement = require('./Routes/userManagement');
const giverDashboard = require('./Routes/giverDashboard');



const cors = require('cors');
const authenticateToken = require('./middleware/authentication');
app.use(cors({
  origin:'*',
}));





app.use(Admin);
app.use(User);
app.use(userManagement);
app.use(giverDashboard);




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


