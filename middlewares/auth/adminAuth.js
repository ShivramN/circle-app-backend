const authMiddleware = require('../auth/authentication')
const __constant = require('../../config/constants')

function authenticateToken (req, res, next) {
  // Assuming you have a JWT token in the 'Authorization' header
  const token = req.headers.authorization

  // Decode the token
  const decodedToken = authMiddleware.decodeToken(token)

  // Check if the token is valid
  if (decodedToken) {
    // Token is valid, proceed to the next middleware or route handler
    req.user = decodedToken.data // Attach the decoded token to the request object if needed
    next()
  } else {
    // Token is invalid or decoding failed
    res.status(401).json({ type: __constant.RESPONSE_MESSAGES.NOT_AUTHORIZED })
  }
}

module.exports = authenticateToken
