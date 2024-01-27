require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
require('./connection');
const Admin = require('./Routes/admin');
const User = require('./Routes/user');
const userManagement = require('./Routes/userManagement');

const cors = require('cors');
app.use(cors({
  origin:'*',
}));

const port = process.env.PORT || 5000;

app.use(Admin);
app.use(User);
app.use(userManagement);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
