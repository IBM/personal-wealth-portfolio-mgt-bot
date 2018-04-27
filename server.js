/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


require('dotenv').config();
var express = require('express');  
var app = express();
var bodyParser = require('body-parser');
var rateLimit = require('express-rate-limit');
var helmet = require('helmet');
var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
var http = require('http').Server(app);
var debug = require('debug')('bot:server');

// Deployment tracking
require('metrics-tracker-client').track();

// configure express
app.use(helmet()); //Helmet helps you secure your Express apps
app.use('/api/', rateLimit({
  windowMs: 60 * 1000, // seconds
  delayMs: 0,
  max: 15
}));


if (process.env.USE_WEBUI) {
  app.use(bodyParser.json());
  app.use(express.static('public'));
}
else if (process.env.USE_TWILIO_SMS) {
  // Twilio posts XML so that's how we'll parse the incoming request
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
}

// Helper Function to check for environment variables
var checkAndRequire = function(envItem, toRequire, debugMessage) {
  if (envItem && envItem.match(/true/i)) {
    if (debugMessage) {
        debug(debugMessage);
    }
    require(toRequire)(app,controller);
  }
};

// configure the channels
var controller = require('./lib/controller');
checkAndRequire(process.env.USE_TWILIO, './lib/bot/twilio', 'Initializing Twilio Bot');
checkAndRequire(process.env.USE_TWILIO_SMS, './lib/bot/twilio-sms', 'Initializing Twilio SMS Bot');
checkAndRequire(process.env.USE_WEBUI, './lib/bot/web-ui', 'Initializing WebUI');

http.listen(port, function () {
  debug('Server listening on port: ' + port);
});

module.exports = http
