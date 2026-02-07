<!-- ![](https://stage-whatsapp.helo.ai/assets/img/logo.png) Demo -->
-------------
#### To Run This Application Follow The Steps Below : 
```sh
$ git clone 
```
```sh 
$ cd ./demo
```
>Create a file named `.env` in app_root/config folder and paste the content at the end of this document in newly created file.

```sh
$ npm i
```
```sh
$ npm run develop
```
-------------

### Swagger Url
http://localhost:3000/demo/api/docs/

#### Developement environment .env file :
```sh

WORKER_TYPE = index
PORT = 3000
BASE_URL = 'http://localhost:3000'
AUTH_CONFIG_API_AUTH_ALIAS = /client
AUTH_CONFIG_SECRET_KEY = 6de5661ab3c401bcb266dff913
AUTH_CONFIG_CIPHER_ALGORITHM = aes-256-ctr
AUTH_CONFIG_API_AUTH_INACTIVE_TIME_FRAME = 720
AUTH_CONFIG_API_AUTH_FORCE_EXPIREY_TIME_FRAME = 1440
AUTH_CONFIG_API_AUTH_API_ACCESS_KEY = hDcbcQxAuGphBBvcMepR
AUTH_CONFIG_API_AUTH_SERVER_DOC_ACCESS_KEY = 7ae9f9a2674c42329142b63ee20fd865
LOGGING_LOG_PATH = /home/gopal/Android/demo
LOGGING_CONSOLE = true
LOGGING_ONLY_CONSOLE = false
LOGGING_LEVEL = silly
LOGGING_DATE_PATTERN = yyyy-MM-dd
LOGGING_MAX_SIZE = 104857600
LOGGING_COLORIZE = true
LOGGING_MONGO_HOST = localhost
LOGGING_MONGO_PORT = 27017
LOGGING_MONGO_USER_NAME = ''
LOGGING_MONGO_PASSWORD = ''
LOGGING_MONGO_ENABLED = false
REDIS_INIT = true
REDIS_HOST = localhost
REDIS_NO_READY_CHECK = true
REDIS_AUTH_PASS = ''
REDIS_PORT = 6379
REDIS_DB = ''
AUTHENTICATION_JWT_SECRET_KEY = 23h3sdk903d40ebcb2hsiw92nu
AUTHENTICATION_INTERNAL_ALLOW = true
AUTHENTICATION_STRATEGY_GOOGLE_OPTIONS_SESSION = false
EMAIL_PROVIDER_SEND_EMAIL = true
EMAIL_PROVIDER_FROM_EMAIL = gopalkrishna.kothari@vivaconnect.co
EMAIL_PROVIDER_SUBJECT_EMAIL_VERIFICATION = Helo Whatsapp Email Verification
EMAIL_PROVIDER_SUBJECT_PASSWORD_RESET = Request For Password EMAIL_PROVIDER_SERVICE
HW_MYSQL_INIT = true
HW_MYSQL_IS_SLAVE = false
HW_MYSQL_OPTIONS_CONNECTION_LIMIT = 20
HW_MYSQL_OPTIONS_HOST = localhost
HW_MYSQL_OPTIONS_USER = root
HW_MYSQL_OPTIONS_PASSWORD = ********
HW_MYSQL_OPTIONS_DATABASE = test
HW_MYSQL_OPTIONS_PORT = 3306
PHOTO_URL = /demo/public/image/
CATEGORY_URL = /demo/public/category/
```