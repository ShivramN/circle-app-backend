const __constants = require('./constants')
const appName = __constants.APP_NAME

module.exports = {
  env: process.env.NODE_ENV,
  app_name: appName,
  api_prefix: appName,
  port: process.env.PORT,
  base_url: process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:' + process.env.PORT,
  authConfig: {
    apiAuthAlias: process.env.AUTH_CONFIG_API_AUTH_ALIAS,
    secretKey: process.env.AUTH_CONFIG_SECRET_KEY,
    cipherAlgorithm: process.env.AUTH_CONFIG_CIPHER_ALGORITHM,
    inactiveTimeFrame: +process.env.AUTH_CONFIG_API_AUTH_INACTIVE_TIME_FRAME,
    forceExpireTimeFrame: +process.env.AUTH_CONFIG_API_AUTH_FORCE_EXPIREY_TIME_FRAME,
    apiAccessKey: process.env.AUTH_CONFIG_API_AUTH_API_ACCESS_KEY,
    serverDocAccessKey: process.env.AUTH_CONFIG_API_AUTH_SERVER_DOC_ACCESS_KEY
  },
  logging: {
    log_file: process.env.LOGGING_LOG_PATH + '/' + appName
  },
  authTokens: process.env.AUTH_TOKENS.split(',') || [],
  aws_s3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    aclAccess: process.env.AWS_S3_ACLS_ACCESS,
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT || null
  },
  circle_app: {
    init: process.env.MYSQL_INIT === 'true',
    name: __constants.MYSQL_NAME,
    is_slave: process.env.MYSQL_IS_SLAVE === 'true',
    options: {
      connection_limit: +process.env.MYSQL_OPTIONS_CONNECTION_LIMIT,
      host: process.env.MYSQL_OPTIONS_HOST,
      user: process.env.MYSQL_OPTIONS_USER,
      password: process.env.MYSQL_OPTIONS_PASSWORD,
      database: process.env.MYSQL_OPTIONS_DATABASE,
      acquireTimeout: 0,
      port: +process.env.MYSQL_OPTIONS_PORT,
      timezone: 'utc'
    }
  },
  authentication: {
    jwtSecretKey: process.env.AUTHENTICATION_JWT_SECRET_KEY,
    adminJwtSecretKey: process.env.AUTHENTICATION_JWT_SECRET_KEY_FOR_ADMIN,
    internal: {
      allow: process.env.AUTHENTICATION_INTERNAL_ALLOW === 'true'
    },
    strategy: {
      jwt: {
        name: 'jwt',
        options: {
          session: process.env.AUTHENTICATION_STRATEGY_GOOGLE_OPTIONS_SESSION === 'true'
        }
      }
    }
  },
  notification: {
    init: process.env.FIREBASE_NOTIFICATION_INIT === 'true',
    options: {
      type: process.env.FIREBASE_NOTIFICATION_TYPE,
      project_id: process.env.FIREBASE_NOTIFICATION_PROJECT_ID,
      private_key_id: process.env.FIREBASE_NOTIFICATION_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_NOTIFICATION_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_NOTIFICATION_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_NOTIFICATION_CLIENT_ID,
      auth_uri: process.env.FIREBASE_NOTIFICATION_AUTH_URI,
      token_uri: process.env.FIREBASE_NOTIFICATION_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_NOTIFICATION_AUTH_PROVIDER_CERTS,
      client_x509_cert_url: process.env.FIREBASE_NOTIFICATION_CLIENT_CERTS,
      universe_domain: process.env.FIREBASE_NOTIFICATION_UNIVERSE_DOMAIN
    }
  },
  emailProvider: {
    sendEmail: process.env.EMAIL_PROVIDER_SEND_EMAIL === 'true',
    service: process.env.EMAIL_PROVIDER_SERVICE,
    host: process.env.EMAIL_PROVIDER_HOST,
    port: +process.env.EMAIL_PROVIDER_PORT,
    auth: {
      user: process.env.EMAIL_PROVIDER_AUTH_USER,
      password: process.env.EMAIL_PROVIDER_AUTH_PASSWORD
    },
    tls: process.env.EMAIL_PROVIDER_TLS === 'true',
    debug: process.env.EMAIL_PROVIDER_DEBUG === 'true',
    fromEmail: process.env.EMAIL_PROVIDER_FROM_EMAIL,
    subject: {
      emailVerification: process.env.EMAIL_PROVIDER_SUBJECT_EMAIL_VERIFICATION,
      passwordReset: process.env.EMAIL_PROVIDER_SUBJECT_PASSWORD_RESET,
      celebrity: process.env.EMAIL_PROVIDER_SUBJECT_CELEBRITY,
      subscriptionTemplate: process.env.EMAIL_PROVIDER_SUBJECT_SUBCRIPTION
    }
  },
  swaggerUrl: {
    platform: process.env.BASE_URL ? process.env.BASE_URL + '/' + __constants.APP_NAME + '/api' : 'http://localhost:' + process.env.PORT + '/' + __constants.APP_NAME + '/api'
  },
  photoUrl: process.env.PHOTO_URL,
  categoryUrl: process.env.CATEGORY_URL,
  newsUrl: process.env.NEWS_URL,
  voicesUrl: process.env.VOICES_URL,
  hashMethod: {
    createHex: process.env.CREATE_HEX,
    HexDigest: process.env.HEX_DIGEST
  },
  thumbnailUrl: process.env.THUMBNAIL_URL,
  subcription: process.env.SUBCRIPTION_URL,
  stripe_key: process.env.SECRECT_KEY,
  stripe_public_key: process.env.PUBLIC_KEY,
  end_point_secret: process.env.END_POINT_SECRET,
  iosAppVersion: process.env.IOSAPPVERSION,
  appStoreAppUrl: process.env.APPSTOREAPPURL
}
