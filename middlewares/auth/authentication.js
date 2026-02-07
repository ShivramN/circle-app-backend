const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const authConfig = require('../../config').authentication

const cookieTokenExtractor = req => {
  var token = null
  if (req && req.cookies) {
    token = req.cookies.jwt
  }
  return token
}

const authHeaderTokenExtractor = req => {
  let token = null
  if (req && req.headers) {
    try {
      if ('authorization' in req.headers) {
        token = req.headers.authorization
      } else {
        token = null
      }
    } catch (e) {
      token = null
    }
  }
  return token
}

const setJwtStrategy = opts => {
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    // custom security validation
    return done(null, jwtPayload.data)
  }))
}

class Authentication {
  constructor () {
    this.app = {}
    this.opts = {
      jwtFromRequest: ExtractJwt.fromExtractors([authHeaderTokenExtractor, cookieTokenExtractor]),
      secretOrKey: authConfig.jwtSecretKey
    }
  }

  initialize (app) {
    this.app = app
    this.app.use(passport.initialize())
    passport.serializeUser((user, done) => {
      done(null, user)
    })
    passport.deserializeUser((obj, done) => {
      done(null, obj)
    })
    this.setStrategy()
  }

  setStrategy () {
    if (authConfig.internal && authConfig.internal.allow) setJwtStrategy(this.opts)
  }

  decodeToken (token) {
    let decodedToken = null
    try {
      decodedToken = jwt.verify(token, authConfig.adminJwtSecretKey)
    } catch (error) {
      decodedToken = null
    }
    return decodedToken
  }

  authenticate (strategy, options) {
    return [passport.authenticate(strategy, options)]
  }

  authenticateNoJwt (strategy, options) {
    return passport.authenticate(strategy, options)
  }

  setToken (data, expirySeconds) {
    return jwt.sign({ data }, this.opts.secretOrKey, { expiresIn: expirySeconds })
  }

  setTokenAdmin (data, expirySeconds) {
    return jwt.sign({ data }, authConfig.adminJwtSecretKey, { expiresIn: expirySeconds })
  }
}

module.exports = new Authentication()
