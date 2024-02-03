require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if(!token) {
    return res.status(401).send({ message: 'Unauthorized '});
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      console.log('Error:', err, 'User:', user);
      if(err) {
        return res.status(403).send({ message: 'Unauthorized access different token'});// if the token has expired or invalid
      }
      req.user = user;
      next();
    })
  } catch (error) {
    res.status(401).send({ message: 'Token is not valid' });
  }
}

module.exports = authenticateToken;



// require('dotenv').config();
// const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//   let token;
//   const authHeader = req.header('Authorization');

//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     token = authHeader.split(' ')[1];
//   } else if (req.query.token) {
//     // For SSE, get the token from query parameters
//     token = req.query.token;
//   } else {
//     return res.status(401).send({ message: 'Unauthorized' });
//   }

//   if (!token) {
//     return res.status(401).send({ message: 'Unauthorized' });
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//       console.log('Error:', err, 'User:', user);
//       if (err) {
//         return res.status(403).send({ message: 'Unauthorized access different token' }); // if the token has expired or invalid
//       }
//       req.user = user;
//       next();
//     })
//   } catch (error) {
//     res.status(401).send({ message: 'Token is not valid' });
//   }
// }

// module.exports = authenticateToken;
