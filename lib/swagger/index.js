var _ = require('lodash')
// var SwaggerUi = require('./swagger-ui-express')
var SwaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerInternalDocument = require('./doc/internal.json')
// const swaggerInternalDocument = YAML.load('./doc/internal.yaml')
const __config = require('../../config')
const __logger = require('../logger')
// const express = require('express')
const __constants = require('../../config/constants')


// var swaggerOptions = {
//   customCss: '.swagger-ui .topbar-wrapper img {content:url("");} .swagger-ui section.models {display: none} ' +
//        `.swagger-ui .topbar {
//           padding: 8px 0;
//           background-color: #d20426;
//           margin-bottom: 10px;
//       }
//       .swagger-ui .topbar a span{
//           text-indent: -9999px;
//           line-height: 0;
//       }
//       .swagger-ui .topbar a span::after{
//           content: "API Documentation";
//           text-indent: 0;
//           display: block;
//           line-height: initial; 
//       }
//       .swagger-ui .info {
//           margin-top: 0px;
//           }` +
//       '#operations-SSP-sspsent .try-out__btn ,#operations-SSP-ssppingback .try-out__btn{ display: none } ' +
//       '#operations-Cron-cronarchive .try-out__btn ,#operations-Cron-optimizePartitionSize .try-out__btn{ display: none }',
//   title: 'Demo API Documentation'
// }
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { background-color: #f00 }',
  title: 'My API Documentation',
};
module.exports = (app, routeUrlPrefix) => {
  // region swagger server api doc
  // var swaggerUiServer = new SwaggerUi()
  // var swaggerUiServerInternal = new SwaggerUi()
  // app.use(routeUrlPrefix + '/jsdocs', express.static(__constants.PUBLIC_FOLDER_PATH + '/js-docs'))
  app.use(routeUrlPrefix + '/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerInternalDocument, swaggerOptions))
  // endregion
  __logger.info('Initializing swagger doc Routes Completed')
}
