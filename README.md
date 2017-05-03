# Personal wealth portfolio management bot

###Placeholder for travis-ci

In this developer journey we will create a financial-based Watson Conversation based chatbot
that allows a user to: 1) use an Investment Portfolio service to query his or her investment portfolios and associated holdings 2) use the Simulated Instrument Analytics service to compute analytics on securities under a given scenario. 3) understand how to swap between alternative interfaces:  a) web interface b) TwilioSMS

When the reader has completed this journey, he or she will understand how to:

* Create a chatbot dialog with Watson Conversation
* Set up multiple interfaces with the Watson Conversation bot: Web & Twilio
* Access, seed and send data to the Portfolio Investment Service
* Send data along with a scenario to the Simulated Instrument Analytics service to retrieve analytics

###
###Placeholder for ARCHITECTURE DIAGRAM
###

## Included Components
- Bluemix Watson Conversation
- Bluemix Cloudant NoSQL DB
- Bluemix
- Bluemix Simulated Instrument Analytics
- TwilioSMS
- Node

# Steps

**NOTE:** Perform steps 1-8 **OR** click the ``Deploy to Bluemix`` button and hit ``Create`` and then jump to step 7.

Use the IBM Cloud for Financial Services to build the future of financial services with to help from Watson and developer starter kits.  Visit https://developer.ibm.com/finance/
.
1. [Clone the repo](#1-clone-the-repo)
2. [Create Bluemix services](#2-create-bluemix-services)
3. [Configure Watson Conversation](#3-configure-watson-conversation)
4. [Configure and Seed the Portfolio Investment](#4-configure-portfolio-investment)
5. [Configure Manifest.yml file](#5-configure-manifest)
6. [Configure .env file](#6-configure-dotenv)
7. [Configure Twilio](#7-configure-twilio)
8. [Run the application](#8-run-the-application)


## 1. Clone the repo

Clone the `personal-wealth-portfoli-mgt-bot code` locally. In a terminal, run:

  `$ git clone https://github.com/IBM/personal-wealth-portfolio-mgt-bot.git`

* We’ll be using the file [`resources/workspace.json`] with the Conversation Service.
* If you don't want to seed your Investment Portfolio service manually, you can use run the file [`resources/Portfolio API's (PROD).postman_collection`] through the tool: [Postman App](https://www.getpostman.com/).
* We'll use the file [`resources/conditional_out.csv`] with the Simulated Instrument Analytics Service.

## 2 Create Bluemix services

Create the following services:

Watson Conversation
Watson Discovery
Cloudant NoSQL DB

* [**Watson Conversation**](https://console.ng.bluemix.net/catalog/services/conversation)
* [**Cloudant NoSQL DB**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)
* [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
* [**Simulated Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/simulated-instrument-analytics)

**Note** For each service with the exception of Cloudant, record the userid, password and URL from the credentials tab.

## 3. Configure Watson Conversation


Launch the **Watson Conversation** tool. Use the **import** icon button on the right

<p align="center">
  <img width="400" height="55" src="doc/source/images/import_conversation_workspace.png">
</p>

Find the local version of [`resources/workspace.json`](resources/workspace.json) and select
**Import**. Find the **Workspace ID** by clicking on the context menu of the new
workspace and select **View details**. Save this ID for later.

<p align="center">
  <img width="400" height="250" src="doc/source/images/open_conversation_menu.png">
</p>

*Optionally*, to view the conversation dialog select the workspace and choose the
**Dialog** tab, here's a snippet of the dialog:

###REPLACE IMAGE WITH IMAGE OF OUR CONVERSATION DIALOG
![](doc/source/images/dialog.png)

## 4. Configure and Seed the Portfolio Investment

Using the Postman Tool:
i. Start Postman
ii. Select *Import* and import [`resources/Portfolio API's (PROD).postman_collection`]
<p align="center">
# <img width="400" height="250" src="doc/source/images/open_conversation_menu.png">
  <img width="400" height="250" src="~/2017-NewRole/Journeys/InvestmentPortfolio-chatbot.png">
</p>

iii. Select *Runner*

iv. Select the [`resources/Portfolio API's (PROD).postman_collection`] from the dropdown

v. Select Start Run

This will create add holdings and their instruments to your Investment Portfolio

Alternatively, you can manually seed your Investment Portfolio. For all these steps - replace userid, password and service url with the credentials from your BlueMix Service.

**NOTE:** If you get a *not Authorized* message - you need to confirm that the credentials you used match the credentials in Bluemix.

i. Create a portfolio entry in your Portfolio Investment Service. Rep

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "name":"P1", "timestamp": "2017-02-24T19:53:56.830Z", "closed": false, "data": { "manager": "Edward Lam" }}' '{service-url}/api/v1/portfolios'`

ii. Create holdings in your entry

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept:application/json' -d '{ "timestamp": "2017-02-24T19:53:56.830Z", "holdings": [ { "asset": "IBM", "quantity": 36}, { "asset": "LNVGY", "quantity": 520 } ] }' '{service-url}/api/v1/portfolios/P1/holdings'`


## 5. Configure Manifest file
Edit the `manifest.yml` file in the folder that contains your code and replace `investment-bot` with a unique name for your application. The name that you specify determines the application's URL, such as `your-application-name.mybluemix.net`. Additional - update the service lables and service names so they match what you have in Bluemix. The relevant portion of the `manifest.yml` file looks like the following:

    ```yml
    declared-services:
    conversation:
       label: Conversation
       plan: free
    BluePic-Cloudant:
       label: cloudantNoSQLDB
       plan: Lite
    Investment-Portfolio-sm:
       label: InvestmentPortfolio
    Instrument-Analytics:
       label: InstrumentAnalytics
    applications:
        - services:
        - Conversation
        - BluePic-Cloudant
        - Investment-Portfolio-sm
       - InstrumentAnalytics
    name: portfolio-chat-newbot
    command: npm start
    path: .
    memory: 512M
    instances: 1
    domain: mybluemix.net
    disk_quota: 1024M
    ```

## 6. Configure .env file

1. Create a `.env` file in the root directory of your clone of the project repository by copying the sample `.env.example` file using the following command:

  ```none
  cp .env.example .env
  ```

    You will update the `.env` with the information you retrieved in steps 6 - 9.

    The `.env` file will look something like the following:

    ```none
    USE_WEBUI=true
    ALCHEMY_API_KEY=

    #CONVERSATION
    CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api
    CONVERSATION_USERNAME=
    CONVERSATION_PASSWORD=
    WORKSPACE_ID=


    #CLOUDANT
    CLOUDANT_URL=

    #TWILIO
    USE_TWILIO=false
    USE_TWILIO_SMS=false
    TWILIO_ACCOUNT_SID=
    TWILIO_AUTH_TOKEN=
    TWILIO_API_KEY=
    TWILIO_API_SECRET=
    TWILIO_IPM_SERVICE_SID=
    TWILIO_NUMBER=
    ```


## 7. Configure Twilio

If you used Deploy to Bluemix, most of the setup is automatic, but not quite all of it. We have to update a couple more environment variables.

**NOTE:** Using Twilio is an option, the application works with the Web UI by default. So only do the Twilio configuration if you are using Twilio.

1. If you have not done so yet, get a phone number from the Twilio service
2. Edit your .env file to add credentials for Twilio. You can get this information from the dashboard when you get a phonen umber for Twilio

##include screen image of dashboard

  * Set the USE_TWILIO variable to *true*.
  * Set the TWILIO_ACCOUNT_SID variable
  * Set the TWILIO_AUTH_TOKEN variable

If you clicked the "deploy to Bluemix" button, save the new values and restart the application in Bluemix, watch the logs for errors.


##7 Run the Application

### If you decided to run the app locally...

Copy the [`env.sample`](env.sample) to `.env`, edit it with the necessary IDs
and run the application.

Insert the `USERNAME`, `PASSWORD` you obtained from the `Service Credentials` tab in BlueMix in the earlier setup steps. You will also need to update `CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME` environment variable with the path to your scenario file. You don't have to update the environment variables that have the URL already stated.

```
1. Create a `.env` file in the root directory of your clone of the project repository by copying the sample `.env.example` file using the following command:

  ```none
  cp .env.example .env
  ```

    You will update the `.env` with the information you retrieved in steps 6 - 9.

    The `.env` file will look something like the following:

    ```none
    USE_WEBUI=true
    ALCHEMY_API_KEY=

    #CONVERSATION
    CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api
    CONVERSATION_USERNAME=
    CONVERSATION_PASSWORD=
    WORKSPACE_ID=


    #CLOUDANT
    CLOUDANT_URL=https://832ee83a-ede3-4073-8ea6-e0d722097c70-bluemix:5040ba293bca4f2077846b2dc4bcaa7219949f3c76b23943a3512eab84841912@832ee83a-ede3-4073-8ea6-e0d722097c70-bluemix.cloudant.com

    #TWILIO
    USE_TWILIO=false
    USE_TWILIO_SMS=false
    TWILIO_ACCOUNT_SID=
    TWILIO_AUTH_TOKEN=
    TWILIO_API_KEY=
    TWILIO_API_SECRET=
    TWILIO_IPM_SERVICE_SID=
    TWILIO_NUMBER=

    #CONVERSATION
    CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api
    CONVERSATION_USERNAME=
    CONVERSATION_PASSWORD=
    WORKSPACE_ID=


    #CLOUDANT
    CLOUDANT_URL=https://832ee83a-ede3-4073-8ea6-e0d722097c70-bluemix:5040ba293bca4f2077846b2dc4bcaa7219949f3c76b23943a3512eab84841912@832ee83a-ede3-4073-8ea6-e0d722097c70-bluemix.cloudant.com


    #TWILIO
    USE_TWILIO=false
    USE_TWILIO_SMS=false
    TWILIO_ACCOUNT_SID=
    TWILIO_AUTH_TOKEN=
    TWILIO_API_KEY=
    TWILIO_API_SECRET=
    TWILIO_IPM_SERVICE_SID=
    TWILIO_NUMBER=+14152124696

    #INVESTMENT PORTFOLIO
    CRED_PORTFOLIO_USERID=
    CRED_PORTFOLIO_PWD=
    URL_GET_PORTFOLIO_HOLDINGS=https://investment-portfolio.mybluemix.net/api/v1/portfolios

    #Instrument Analytics
    CRED_INSTRUMENT_ANALYTICS_URL=https://fss-analytics.mybluemix.net/api/v1/instrument
    CRED_INSTRUMENT_ANALYTICS_ACCESSTOKEN=

    CRED_SIMULATED_INSTRUMENT_ANALYTICS_URL=https://fss-analytics.mybluemix.net/api/v1/scenario/instrument
    CRED_SIMULATED_INSTRUMENT_ANALYTICS_ACCESSTOKEN=
    CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME=
    ```

    # Sample output

    Start a conversation with your bot:
    <p align="center">
      <img width="400" height="55" src="doc/source/images/conversation_sample.png">
    </p>

### If you decided to push your application to Bluemix

* Push the updated application live by running the following command:

  ```none
  cf push
  ```

# Troubleshooting

    * Help! I'm seeing errors in my log

    This is expected during the first run. The app tries to start before the Discovery
    service is fully created. Allow a minute or two to pass, the following message
    should appear:

    ``Watson Online Store bot is connected and running!``

    * If you are running locally - inspect your environment varibles closely to confirm they match.

    The credentials for Bluemix services (Conversation, Cloudant, and Discovery), can
    be found in the ``Services`` menu in Bluemix, and selecting the ``Service Credentials``
    option.

    * To troubleshoot your Bluemix application, use the logs. To see the logs, run:

    ```bash
    cf logs <application-name> --recent
    ```

    * Alternatively, you can debug the application by going to `https://<name of your application>.mybluemix.net/debug.html` to see a panel that shows metadata which contains details on the interaction with the services being used.

# License

[Apache 2.0](LICENSE)

# Privacy Notice

This node sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a Deployment Tracker service on each deployment:

* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)

This data is collected from the `VCAP_APPLICATION` environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require('cf-deployment-tracker-client').track();` from the beginning of the `server.js` file at the root of this repository.
