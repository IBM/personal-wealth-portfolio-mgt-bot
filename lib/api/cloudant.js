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

// The cloudant.js is the central point used to save and retrieve content from the DB

var extend = require('extend');
//var cloudant = require('cloudant')(process.env.CLOUDANT_URL);
var dbname = 'customers';
var botdb = null;
var vcapServices = require('vcap_services');
var dbCredentials = {
    dbName: 'customers'
};
var cloudant;

//var cloudant = require('cloudant')({vcapServices: JSON.parse(process.env.VCAP_SERVICES)});

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
        console.log("credentials ", dbCredentials.url);
}
 cloudant = require('cloudant')(dbCredentials.url);

}

/*if (process.env.VCAP_SERVICES) {
  vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  cloudant_creds = vcapServices.getCredentials('cloudantNoSQLDB');
  cloudant_url = cloudant_creds.url;
}

if vcap_env {
  cloudant_creds = vcap_env.getCredentials('cloudantNoSQLDB');
  cloudant_username = cloudant_creds.userid;
  cloudant_password = cloudant_creds.password;
  cloudant_url = cloudant_creds.url;
}

cloudant = require('cloudant')(cloudant_url);*/




try{
  botdb = cloudant.db.create(dbCredentials.dbname);
  if (botdb != null){
    botdb = cloudant.db.use(dbCredentials.dbname);
  }
}catch(e){
  botdb = cloudant.db.use(dbCredentials.dbname);
}

module.exports = {
  /**
   * Returns an element by id or undefined if it doesn't exists
   * @param  {[type]}   params._id The user id
   * @param  {Function} callback The callback
   * @return {void}
   */

  get: function(params, callback) {
    botdb.get(params, function(err, response) {
      if (err) {
        if (err.error !== 'not_found') {
          return callback(err);
        } else {
          return callback(null);
        }
      } else {
        return callback(null, response);
      }
    });
  },
  /**
   * Inserts an element in the database
   * @param  {[type]}   params._id The user id
   * @param  {Function} callback The callback
   * @return {void}
   */
  put: function(params, callback) {
    botdb.insert(params, callback);
  }
};
