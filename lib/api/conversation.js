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
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
//var conversationCredentials = vcapServices.getCredentials('conversation');

const conversation = new AssistantV1({ 
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: '2018-02-16'
});

const WatsonAssistantSetup = require('./watson-assistant-setup');

// After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
var vcapServices = require('vcap_services');


const fs = require('fs');
const DEFAULT_NAME = 'portfolio-chat-newbot';

// setupError will be set to an error message if we cannot recover from service setup or init error.
let setupError = '';


//check if the workspace ID is specified in the environment
var conversationWorkspace = process.env.WORKSPACE_ID;
let workspace_ID; // workspaceID will be set when the workspace is created



// if not, create one
if (!conversationWorkspace) {
  const assistantSetup = new WatsonAssistantSetup(conversation);
  const workspaceJson = JSON.parse(fs.readFileSync('resources/workspace.json'));
  const assistantSetupParams = { default_name: DEFAULT_NAME, workspace_json: workspaceJson };
  assistantSetup.setupAssistantWorkspace(assistantSetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Watson Assistant is ready!');
    workspace_ID = data;
  }
  });
}
else {
  workspace_ID = conversationWorkspace;
}


var debug = require('debug')('bot:api:conversation');

function dayOfWeekAsString(dayIndex) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex % 7];
}

/**
 * Handle setup errors by logging and appending to the global error text.
 * @param {String} reason - The error message for the setup error.
 */
function handleSetupError(reason) {
  setupError += ' ' + reason;
  console.error('The app failed to initialize properly. Setup and restart needed.' + setupError);
  // We could allow our chatbot to run. It would just report the above error.
  // Or we can add the following 2 lines to abort on a setup error allowing Bluemix to restart it.
  console.error('\nAborting due to setup error!');
  process.exit(1);
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

    // add in workspace id to conversation payload
    if (!_params.workspace_id) {
      _params.workspace_id = workspace_ID;
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