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

// Conversation.js is the central point for retrieving and sending messages to the bot. It takes the financial questions
// and makes calls to the respective Portfolio Investment and Simulated Instrument Analysis services. 

var extend = require('extend');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

// If unspecified here, the Cloudant_URL env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
var vcapServices = require('vcap_services');
var conversationCredentials = vcapServices.getCredentials('conversation');

var conversation = new AssistantV1({
  version: '2018-02-16',
  path: {
    workspace_id: process.env.WORKSPACE_ID
  }
});

var debug = require('debug')('bot:api:conversation');

function dayOfWeekAsString(dayIndex) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex % 7];
}

module.exports = {
  /**
   * Sends a message to the conversation. If context is null it will start a new conversation
   * @param  {Object}   params   The conversation payload. See: http://www.ibm.com/watson/developercloud/conversation/api/v1/?node#send_message
   * @param  {Function} callback The callback
   * @return {void}
   */
  message: function(params, callback) {
    

    // 1. Set the context - today and tomorrow's day of the week
    var now = new Date();
    var context = {
      today: dayOfWeekAsString(now.getDay()),
      tomorrow: dayOfWeekAsString(now.getDay() + 1)
    };

    var _params = extend({}, params);
    
    if (!_params.context) {
      _params.context = {};
      _params.context.system = {
        dialog_stack: ['root'],
        dialog_turn_counter: 1,
        dialog_request_counter: 1
      }
    }

    var newMessage = extend(true, _params, {context: context});
    
      // Get the message to the Conversation service
      conversation.message(newMessage, function(err, response) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, response);
      }
    });

  }
}