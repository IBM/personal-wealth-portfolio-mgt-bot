<p align="center">
  <img width="800" height="400" src="readme_images/arch-fin-mgmt.png">
</p>

# Personal Wealth Portfolio Management Bot

[![Build Status](https://travis-ci.org/IBM/personal-wealth-portfolio-mgt-bot.svg?branch=master)](https://travis-ci.org/IBM/personal-wealth-portfolio-mgt-bot)
![IBM Cloud Deployments](https://metrics-tracker.mybluemix.net/stats/d6bc3e71109a7049ffee8f2ae2c857c9/badge.svg)

*Read this in other languages: [한국어](README-ko.md)、[中国](README-cn.md).*

In this developer pattern we will create a financial-based Watson Conversation based chatbot
that allows a user to: 1) use an Investment Portfolio service to query his or her investment portfolios and associated holdings 2) use the Simulated Instrument Analytics service to compute analytics on securities under a given scenario. 3) understand how to swap between alternative interfaces:  a) web interface b) TwilioSMS

When the reader has completed this pattern, he or she will understand how to:

* Create a chatbot dialog with Watson Conversation
* Set up multiple interfaces with the Watson Conversation bot: Web & Twilio
* Access, seed and send data to the Investment Portfolio Service
* Send data along with a scenario to the Simulated Instrument Analytics service to retrieve analytics

Click here to view the [IBM Pattern](https://developer.ibm.com/code/patterns/create-an-investment-management-chatbot/) for this project.

## Prerequisites
You will need the following accounts and tools:
* [IBM Cloud account](https://console.ng.bluemix.net/registration/)
* [Bluemix CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/index.html#getting-started)

## Included Components
- IBM Cloud Watson Conversation
- IBM Cloud Cloudant NoSQL DB
- IBM Cloud Investment Portfolio
- IBM Cloud Simulated Instrument Analytics
- TwilioSMS

## Steps

Use the ``Deploy to IBM Cloud`` button **OR** create the services and run ``Run Locally``.

Use the IBM Cloud for Financial Services to build the future of financial services with to help from Watson and developer starter kits.  Visit https://developer.ibm.com/finance/


## Deploy to IBM Cloud

[![Deploy to IBM Cloud](https://metrics-tracker.mybluemix.net/stats/d6bc3e71109a7049ffee8f2ae2c857c9/button.svg)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/IBM/personal-wealth-portfolio-mgt-bot)

1. Log in to your IBM Cloud account before deploying. If already logged in, then ignore this step.
![](readme_images/bm-deploy-img.png)

2. We can see that the app is ready to be deployed, and we need to ensure that the App name, region, Organization, Space is valid before pressing 'Deploy'.
![](readme_images/bm-deploy-step2.png)

3. In Toolchain, the app is deployed. There are also option to edit code via eclipseIDE, git changes if required.
![](readme_images/bm-deploy-step3.png)

4. You should see two stages pass successfully once your **Deploy Stage** completes
![](readme_images/bm-deploy-step4.png)

5. To see the app and services created and configured for this pattern, use the IBM Cloud dashboard. The app is named personal-wealth-portfolio-mgt-bot with a unique suffix:

 * [**Watson Conversation**](https://console.ng.bluemix.net/catalog/services/conversation)
 * [**Cloudant NoSQL DB**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)
 * [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
 * [**Simulated Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/simulated-instrument-analytics)

**Note** There are a few more steps you need to complete before you can run the application.

Before you start the configuration process, clone the `personal-wealth-portfoli-mgt-bot` code locally. In a terminal window, run:

  `$ git clone https://github.com/IBM/personal-wealth-portfolio-mgt-bot.git`

## A. Configure Watson Conversation

The Conversation service must be trained before you can successfully use this application.  The training data is provided in the file: [`resources/workspace.json`](resources/workspace.json)

  1. Make sure you are logged into IBM Cloud

  2. Navigate to upper left hand side and click on the 3 parallel lines and select Dashboard from the left hand navigation panel.

  3. Scroll down and under "All Services" - select the instance of the Conversation service that you are using

  4. Once on the Service details page, scroll down (if necessary) and click green Launch tool button on the right hand side of the page. This will launch the tooling for the Conversation service, which allows you to build dialog flows and train your chatbot. This should take you to your workspace in the Conversation service which represents a unique set of chat flows and training examples. This allows you to have multiple chatbots within a single instance of the Conversation service.

  5. Once on the page, you will see the option to either “Create” a new workspace, or “import” an existing one. We are going to “import” a premade chatbot for this example, so select “Import" (click on the arrow next to the create button).

  <p align="center">
    <img width="400" height="250" src="readme_images/ImportArrow.png">
  </p>

  6. Click Choose a file, navigate to the resources directory of your clone of the repository for this project, and select the file workspace.json. Once the file is selected, ensure that the “Everything (Intents, Entities, and Dialog” option is selected.

  7. Click Import to upload the .json file to create a workspace and train the model used by the Conversation service.

**<span style="color:red">Note:**</span> Record your Workspace ID to use in [Step C](#c-configuring-your-environment-variables-in-bluemix).

To find your workspace ID once training has completed, click the three vertical dots in the upper right-hand corner of the Workspace pane, and select View details. Once the upload is complete, you will see a new workspace.  In order to connect this workspace to our application, we will need to include the Workspace ID in our environment variables  on your application dashboard (if you used the ``Deploy to IBM Cloud`` button or save in the file “.env” if you are deploying ``locally``. Save this id.

*Optionally*, you may want to explore the conversation dialog. select the workspace and choose the **Dialog** tab, here's a snippet of the dialog:

<p align="center">
  <img width="400" height="250" src="readme_images/dialog.png">
</p>


## B. Seed the Investment Portfolio Service

You now need to manually seed your Investment Portfolio. For all these steps - replace **userid, password** with the credentials from your IBM Cloud Service.

i. Example of manually creating a portfolio entry in your Portfolio Investment Service:

**NOTE**
* {service-user-id} is the user id associated with your Portfolio Investment Service
* {service-user_password} is the password associated with your Portfolio Investment Service

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "name":"P1", "timestamp": "2017-02-24T19:53:56.830Z", "closed": false, "data": { "manager": "Edward Lam" }}' 'https://investment-portfolio.mybluemix.net/api/v1/portfolios'`

ii. Example of manually creating holdings in your entry:

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept:application/json' -d '{ "timestamp": "2017-05-05T19:53:56.830Z", "holdings": [ { "asset": "IBM", "quantity": 1500, "instrumentId": "CX_US4592001014_NYQ"}, { "asset": "GE", "quantity": 5000, "instrumentId": "CX_US3696041033_NYQ" }, { "asset": "F", "quantity": 5000, "instrumentId": "CX_US3453708600_NYQ" }, { "asset": "BAC", "quantity": 1800, "instrumentId": "CX_US0605051046_NYS" } ] }' 'https://investment-portfolio.mybluemix.net/api/v1/portfolios/P1/holdings'`


## C. Configuring your Environment Variables in IBM Cloud
Before you can actually run the application, you need to manually update three environment variables in IBM Cloud:

Go to the `runttime` tab of your application.  Scroll to the bottom of the screen and `Add` the following environment variables:

**<span style="color:red">Note:</span>** Replace the `Value` for Workspace ID with the one you noted in [Step A](#a-configure-watson-conversation).


| Name                                                  | Value                                |
|-------------------------------------------------------|--------------------------------------|
| WORKSPACE_ID                                          | 5b4d1d87-a712-4b24-be39-e7090421b014 |
| USE_WEBUI                                             | true                                 |
| CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME | ./resources/spdown5_scenario.csv     |

Click **Save** to redeploy your application.

## D. Running application from IBM Cloud
Now you are ready to run your application from IBM Cloud. Select the URL
![](readme_images/runningappurl.png)

**NOTE:** If you get a *not Authorized* message - you need to confirm that the credentials you used match the credentials in IBM Cloud.

# Running Application Locally
> NOTE: These steps are only needed when running locally instead of using the ``Deploy to IBM Cloud`` button

1. [Clone the repo](#1-clone-the-repo)
2. [Create IBM Cloud services](#2-create-bluemix-services)
3. [Configure Watson Conversation](#3-configure-watson-conversation)
4. [Seed Investment Portfolio](#4-seed-investment-portfolio)
5. [Configure Manifest file](#5-configure-manifest)
6. [Configure .env file](#6-configure-env-file)
7. [Update ``controller.js`` file](#7-update-file)
8. [Run the application](#8-run-application)


## 1. Clone the repo

Clone the `personal-wealth-portfoli-mgt-bot code` locally. In a terminal, run:

  `$ git clone https://github.com/IBM/personal-wealth-portfolio-mgt-bot.git`

## 2. Create IBM Cloud services

Create the following services:

* [**Watson Conversation**](https://console.ng.bluemix.net/catalog/services/conversation)
* [**Cloudant NoSQL DB**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)
* [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
* [**Simulated Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/simulated-instrument-analytics)

**Note**
* Because this pattern uses 4 IBM Cloud services, you may hit your limit for the number of services you have instantiated. You can get around this by removing services you don't need anymore. Additionally - if you hit the limit on the number of Apps you have created, you may need to also remove any that you don't need anymore.
* Record the userid, password from the credentials tab on the Conversation Service.

## 3. Configure Watson Conversation
> NOTE: Execute section A of the ``Deploy to Bluemix`` section

## 4. Seed Investment Portfolio
> NOTE: Execute section B of the ``Deploy to Bluemix`` section

## 5. Configure Manifest
Edit the `manifest.yml` file in the folder that contains your code and replace `portoflio-chat-newbot` with a unique name for your application. The name that you specify determines the application's URL, such as `your-application-name.mybluemix.net`. Additional - update the service lables and service names so they match what you have in IBM Cloud. The relevant portion of the `manifest.yml` file looks like the following:

    ```yml
    declared-services:
    conversation:
       label: Conversation
       plan: free
    Cloudant-service:
       label: cloudantNoSQLDB
       plan: Lite
    investment-portfolio-service:
       label: fss-portfolio-service
    instrument-analytics:
       label: fss-scenario-analytics-service
    applications:
        - services:
        - Conversation
        - Cloudant-service
        - investment-portfolio-service
        - instrument-analytics-service
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

**NOTE** Most files systems regard files with a "." at the front as hidden files.  If you are on a Windows system, you should be able to use either [GitBash](https://git-for-windows.github.io/) or [Xcopy](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true)


  ```none
  cp .env.example .env
  ```

  You will need to update the credentials with the IBM Cloud credentials for each of the services you created in [Step 2](#2-create-bluemix-services).

    The `.env` file will look something like the following:

    ```none

    USE_WEBUI=true

    #CONVERSATION
    CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api
    CONVERSATION_USERNAME=
    CONVERSATION_PASSWORD=
    WORKSPACE_ID=

    #CLOUDANT
    CLOUDANT_URL=

    #INVESTMENT PORTFOLIO
    CRED_PORTFOLIO_USERID=
    CRED_PORTFOLIO_PWD=
    URL_GET_PORTFOLIO_HOLDINGS=https://investment-portfolio.mybluemix.net/api/v1/portfolios

    CRED_SIMULATED_INSTRUMENT_ANALYTICS_URL=https://fss-analytics.mybluemix.net/api/v1/scenario/instrument
    CRED_SIMULATED_INSTRUMENT_ANALYTICS_ACCESSTOKEN=
    CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME=

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

## 7. Update file

One additional step is that you need to comment out two lines in the Controller file to set the userid & password of the investment portfolio service (lines 66-70)
![](readme_images/commentlines.png)

## 8. Run Application

a. Install the dependencies you application need:

```none
npm install
```

b. Start the application locally:

```none
npm start
```

c. Test your application by going to: [http://localhost:3000/](http://localhost:3000/)


    Start a conversation with your bot:
<p align="center">
      <img width="300" height="200" src="readme_images/conversationsample.png">
</p>


## Configure Twilio (Optional if you want your app to interface with Twilio)

You still have one more step if you are planning to use Twilio as the interface. We have to update a couple more environment variables. Again - this is an optional step. By default the app interfaces with a WebUI; but this enables an interface with Twilio.

**NOTE:** Using Twilio is an option, the application works with the Web UI by default. So only do the Twilio configuration if you are using Twilio.

1. If you have not done so yet, get a phone number from the Twilio service. https://www.twilio.com/
2. Edit your .env file to add credentials for Twilio. You can get this information from the dashboard when you get a phone number for Twilio

<p align="center">
  <img width="300" height="250" src="readme_images/Twilio-dashboard.png">
</p>

  * Set the USE_TWILIO_SMS variable to *true*.
  * Set the TWILIO_ACCOUNT_SID variable
  * Set the TWILIO_AUTH_TOKEN variable
  * Set the TWILIO_NUMBER variable

If you clicked the "Deploy to IBM Cloud" button, save the new values and restart the application in IBM Cloud, watch the logs for errors.

In order to have Twilio listen to the local port (:3000), you need to set up a tunnel a webhook. You can use the tool *ngrok* https://ngrok.com/. Go ahead and download ngrok.  Open a terminal window and start ngrok by using the command:

```none
ngrok http 3000
```

**Note:** use port 80 if you are running the application from IBM Cloud.

You will get a response like the following:

<p align="center">
  <img width="300" height="200" src="readme_images/ngrok-dashboard.png">
</p>

Copy the https uri and paste it into the entry field for your SMS Webhook (inside the Twilio dashboard):

<p align="center">
  <img width="300" height="200" src="readme_images/webhook-dashboard.png">
</p>



# Adapting/Extending the pattern

One can enhance the current application by adding in additional financial services. Xignite, Inc. (http://xignite.com)  provides cloud-based financial market data APIs that work side by side with the IBM Cloud Fintech services.  Specifically, the GetGlobalDelayedQuotes() Rest API is available to provide delayed quotes for a specific global security.

<p align="center">
  <img width="400" height="150" src="readme_images/Extensions.png">
</p>

# Troubleshooting

    * To troubleshoot your IBM Cloud application, use the logs. To see the logs, run:

    ```bash
    cf logs <application-name> --recent
    ```

    * If you are running locally - inspect your environment varibles closely to confirm they match.

    The credentials for IBM Cloud services (Conversation, Cloudant, and Discovery), can
    be found in the ``Services`` menu in IBM Cloud, and selecting the ``Service Credentials``
    option.


    * Alternatively, you can debug the application by going to `https://<name of your application>.mybluemix.net/debug.html` to see a panel that shows metadata which contains details on the interaction with the services being used.

# License

[Apache 2.0](LICENSE)

# Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Cloud](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM/metrics-collector-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Application GUID (`application_id`)
* Application instance index number (`instance_index`)
* Space ID (`space_id`) or OS username
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Cloud Foundry API (`cf_api`)
* Labels and names of bound services
* Number of instances for each bound service and associated plan information
* Metadata in the repository.yaml file

This data is collected from the `package.json` and `repository.yaml` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Cloud and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Cloud to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require('metrics-tracker-client').track();` from the beginning of the `server.js` file at the root of this repository.

## License
[Apache 2.0](LICENSE)
