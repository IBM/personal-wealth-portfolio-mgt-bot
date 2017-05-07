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
var bodyParser = require('body-parser');

var debug = require('debug')('bot:channel:twilio-sms');
var TwilioSMSBot = require('botkit-sms');
var twilioSmsBot = TwilioSMSBot({
  log: false,
  account_sid: process.env.TWILIO_ACCOUNT_SID,
  auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_number: process.env.TWILIO_NUMBER
});

module.exports = function (app, controller) {
      app.use( bodyParser.urlencoded({ extended: true }));

      app.post('/sms', function(req, res) {
        //debug('message: %s', JSON.stringify(req.body));
        //console.log('req.body',  JSON.stringify(req));
        var twilio = require('twilio');
        var twiml = new twilio.TwimlResponse();
        controller.processMessage(req.body, res, function(err, response) {
          //console.log('response is',  response.output.text);
          twiml.message(response.output.text);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        })
     });
}

