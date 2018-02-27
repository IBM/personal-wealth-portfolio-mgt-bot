# Bot de gerenciamento da carteira de patrimônio pessoal

[![Build Status](https://travis-ci.org/IBM/personal-wealth-portfolio-mgt-bot.svg?branch=master)](https://travis-ci.org/IBM/personal-wealth-portfolio-mgt-bot)

*Ler em outros idiomas: [한국어](README-ko.md).*

Nesta jornada do desenvolvedor, criaremos um chatbot financeiro baseado no Watson Assistant for Business que ajudará o usuário a: 1) usar um serviço Investment Portfolio para consultar suas carteiras de investimentos e capitais associados; 2) usar o serviço Simulated Instrument Analytics para calcular a analytics em valores mobiliários em um cenário específico; 3) entender como alternar entre interfaces alternativas: a) interface da web ou b) TwilioSMS.

Depois de concluir esta jornada, o leitor saberá como:

* Criar um diálogo de chatbot com o Watson Assistant for Business
* Configurar várias interfaces com o bot do Watson Assistant for Business: Web e Twilio
* Acessar, distribuir e enviar dados para o serviço Investment Portfolio
* Enviar dados, junto com um cenário, para o serviço Simulated Instrument Analytics a fim de recuperar a analytics

<p align="center">
  <img width="800" height="400" src="readme_images/arch-fin-mgmt.png" />
</p>

## Componentes inclusos
- Bluemix Watson Assistant for Business
- Banco de dados NoSQL do Bluemix Cloudant - Bluemix Investment Portfolio
- Bluemix Simulated Instrument Analytics
- TwilioSMS

## Etapas

Use o botão ``Deploy to Bluemix`` **OU** crie os serviços e execute ``Run Locally``.

Use a Nuvem IBM para Serviços Financeiros para determinar o futuro dos serviços financeiros com ajuda do Watson e dos kits de início para desenvolvedores. Acesse https://developer.ibm.com/finance/

## Deploy to Bluemix

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/IBM/personal-wealth-portfolio-mgt-bot)

1. Efetue login na sua conta do Bluemix antes de implementar. Caso já tenha efetuado login, ignore esta etapa. ![](readme_images/bm-deploy-img.png)

2. Podemos ver que o aplicativo está pronto para ser implementado e precisamos verificar se o nome, a região, a organização e o espaço dele são válidos antes de pressionar 'Deploy'. ![](readme_images/bm-deploy-step2.png)

3. Na cadeia de ferramentas, o aplicativo é implementado. Também existe a opção de editar o código por meio do eclipseIDE; o git muda, se necessário. ![](readme_images/bm-deploy-step3.png)

4. Duas fases devem passar com êxito após a conclusão da **Fase de Implementação** ![](readme_images/bm-deploy-step4.png)

5. Para ver o aplicativo e os serviços criados e configurados para esta jornada, use o painel do Bluemix. O aplicativo se chama personal-wealth-portfolio-mgt-bot com um sufixo exclusivo:

* [**Watson Assistant for Business**](https://console.ng.bluemix.net/catalog/services/conversation)
* [**Banco de dados NoSQL do Cloudant**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)
* [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
* [**Simulated Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/simulated-instrument-analytics)

**Observação** Você precisa concluir mais algumas etapas antes de poder executar o aplicativo.

Antes de iniciar o processo de configuração, clone o código `personal-wealth-portfoli-mgt-bot` localmente. Em uma janela do terminal, execute:

`$ git clone https://github.com/IBM/personal-wealth-portfolio-mgt-bot.git`

## A. Configurar o Watson Assistant for Business

O serviço Assistant for Business precisa ser treinado para que você possa usar esse aplicativo com êxito. Os dados de treinamento são fornecidos no arquivo: [`resources/workspace.json`](resources/workspace.json)

1. Confira se você efetuou login no Bluemix

2. Navegue até o canto superior esquerdo, clique nas três linhas paralelas e selecione Dashboard no painel de navegação esquerdo.

3. Role para baixo e, em “All Services”, selecione a instância do serviço Assistant for Business que você está usando

4. Na página de detalhes do serviço, role para baixo (se necessário) e clique no botão verde Launch tool, no lado direito da página. Será acionado o conjunto de ferramentas para o serviço Assistant for Business, que permite que você desenvolva fluxos de diálogo e treine seu chatbot. Você deve ser conduzido à sua área de trabalho no serviço Assistant for Business, que representa um conjunto exclusivo de fluxos de bate-papo e exemplos de treinamento. Assim, é possível ter vários chatbots dentro de uma única instância do serviço Assistant for Business.

5. Na página, você verá a opção de criar uma área de trabalho nova (“Create”) ou importar uma existente (“Import”). Vamos importar um chatbot pronto para este exemplo; portanto, selecione “Import” (clique na seta ao lado do botão Create).

  <p align="center">
    <img width="400" height="250" src="readme_images/ImportArrow.png" />
  </p>

  6. Clique em Choose a file, navegue até o diretório de recursos do clone do repositório para esse projeto e selecione o arquivo workspace.json. Depois que o arquivo for selecionado, verifique se a opção “Everything (Intents, Entities, and Dialog)” foi escolhida.

  7. Clique em Import para fazer upload do arquivo .json a fim de criar uma área de trabalho e treinar o modelo usado pelo serviço Assistant for Business.

  **<span style="color:red">Observação:**</span> registre seu ID da área de trabalho para usar na [Etapa C](#c-configuring-your-environment-variables-in-bluemix).

  Para localizar seu ID da área de trabalho após o fim do treinamento, clique nos três pontos verticais localizados no canto superior direito da área de janela Workspace e selecione View details. Após a conclusão do upload, você verá uma nova área de trabalho. Para conectar essa área de trabalho ao nosso aplicativo, precisaremos incluir o ID da área de trabalho nas variáveis de ambiente no painel do aplicativo (se você usou o botão ``deploy to Bluemix`` ou salvou no arquivo “.env” caso esteja implementando``locally``). Salve esse ID.

  *Como opção*, você pode explorar o diálogo do Assistant for Business. Selecione a área de trabalho e escolha a guia **Dialog**. Este é um fragmento do diálogo:

<p align="center">
  <img width="400" height="250" src="readme_images/dialog.png" />
</p>


## B. Distribuir o Serviço Investment Portfolio

Agora, você precisa distribuir manualmente seu Investment Portfolio. Para todas estas etapas, substitua **userid, password** pelas credenciais do seu Serviço do Bluemix.

i. Exemplo de criação manual de uma entrada de carteira no Serviço Portfolio Investment:

**OBSERVAÇÃO**
* {service-user-id} é o ID do usuário associado ao seu Serviço Portfolio Investment
* {service-user_password} é a senha associada ao seu Serviço Portfolio Investment

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "name":"P1", "timestamp": "2017-02-24T19:53:56.830Z", "closed": false, "data": { "manager": "Edward Lam" }}' 'https://investment-portfolio.mybluemix.net/api/v1/portfolios'`

ii. Exemplo de criação manual de capital na sua entrada:

`curl -X POST -u "{service-user-id}":"{service-user_password}" --header 'Content-Type: application/json' --header 'Accept:application/json' -d '{ "timestamp": "2017-05-05T19:53:56.830Z", "holdings": [ { "asset": "IBM", "quantity": 1500, "instrumentId": "CX_US4592001014_NYQ"}, { "asset": "GE", "quantity": 5000, "instrumentId": "CX_US3696041033_NYQ" }, { "asset": "F", "quantity": 5000, "instrumentId": "CX_US3453708600_NYQ" }, { "asset": "BAC", "quantity": 1800, "instrumentId": "CX_US0605051046_NYS" } ] }' 'https://investment-portfolio.mybluemix.net/api/v1/portfolios/P1/holdings'`

## C. Configurando as Variáveis de Ambiente no Bluemix
Antes de poder realmente executar o aplicativo, você precisa atualizar manualmente três variáveis de ambiente no Bluemix:

Acesse a guia `runttime` do seu aplicativo. Role até a parte inferior da tela e inclua (`Add`) as variáveis de ambiente a seguir:

**<span style="color:red">Observação:</span>** substitua`Value` referente ao ID da Área de Trabalho pelo que você anotou na [Etapa A](#a-configure-watson-conversation).

| Nome | Valor | |-------------------------------------------------------|--------------------------------------| | WORKSPACE_ID | 5b4d1d87-a712-4b24-be39-e7090421b014 | | USE_WEBUI | true | | CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME | ./resources/spdown5_scenario.csv |

Clique em **Save** para implementar seu aplicativo novamente.

## D. Executando um aplicativo do Bluemix
Agora, você está pronto para executar seu aplicativo do Bluemix. Selecione a URL ![](readme_images/runningappurl.png)

**OBSERVAÇÃO:** se receber uma mensagem *not Authorized*, você precisará confirmar se as credenciais utilizadas correspondem às credenciais do Bluemix.

# Executando o Aplicativo Localmente
> NOTE: Estas etapas são necessárias apenas ao executar localmente em vez de usar o botão ``Deploy to Bluemix``

1. [Clonar o repositório](#1-clone-the-repo)
2. [Criar serviços do Bluemix](#2-create-bluemix-services)
3. [Configurar o Watson Assistant for Business](#3-configure-watson-conversation)
4. [Distribuir o Investment Portfolio](#4-seed-investment-portfolio)
5. [Configurar o arquivo Manifest](#5-configure-manifest)
6. [Configurar o arquivo .env](#6-configure-env-file)
7. [Atualizar o arquivo ``controller.js``](#7-update-file)
8. [Executar o aplicativo](#8-run-application)

## 1. Clonar o repositório

Clone o `personal-wealth-portfoli-mgt-bot code` localmente. Em um terminal, execute:

`$ git clone https://github.com/IBM/personal-wealth-portfolio-mgt-bot.git`

## 2. Criar serviços do Bluemix

Crie os serviços a seguir:

* [**Watson Assistant for Business**](https://console.ng.bluemix.net/catalog/services/conversation)
* [**Banco de dados NoSQL do Cloudant**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)
* [**Investment Portfolio**](https://console.ng.bluemix.net/catalog/services/investment-portfolio)
* [**Simulated Instrument Analytics**](https://console.ng.bluemix.net/catalog/services/simulated-instrument-analytics)

**Observação**
* Como esta Jornada utiliza quatro serviços do Bluemix, você poderá atingir o limite de número de serviços que foram instanciados. Para evitar isso, remova os serviços dos quais não precisa mais. Além disso, caso atinja o limite de número de aplicativos criados, talvez você precise remover alguns que não são mais necessários.
* Registre o ID do usuário e a senha da guia Credentials no Serviço Assistant for Business.

## 3. Configurar o Watson Assistant for Business
> NOTE: Execute a seção A da seção ``Deploy to Bluemix``

## 4. Distribuir o Investment Portfolio
> NOTE: Execute a seção B da seção ``Deploy to Bluemix``

## 5. Configurar o Manifest
Edite o arquivo `manifest.yml` na pasta que contém seu código e substitua `portoflio-chat-newbot` por um nome exclusivo para seu aplicativo. O nome especificado determina a URL do aplicativo, como `your-application-name.mybluemix.net`. Adicional: atualize as etiquetas de serviço e os nomes de serviço para que correspondam ao que você tem no Bluemix. A parte relevante do arquivo `manifest.yml` tem esta aparência:

    ```yml
    declared-services:
    conversation:
      label: Assistant for Business
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
      - Assistant for Business
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

## 6. Configurar o arquivo .env

1. Para criar um arquivo `.env` no diretório raiz do seu clone do repositório do projeto, copie o arquivo `.env.example` de amostra usando este comando:

**OBSERVAÇÃO** A maioria dos sistemas de arquivos considera arquivos com um "." na frente como arquivos ocultos. Se estiver em um sistema Windows, você deverá conseguir usar [GitBash](https://git-for-windows.github.io/) ou [Xcopy](https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true)

  ```none
  cp .env.example .env
  ```

  Você precisará atualizar as credenciais com as credenciais do Bluemix para cada serviço criado na [Etapa 2](#2-create-bluemix-services).

  O arquivo `.env` será parecido com o exemplo a seguir:

  ```none

  USE_WEBUI=true

  #CONVERSATION CONVERSATION_URL=https://gateway.watsonplatform.net/conversation/api
  CONVERSATION_USERNAME=
  CONVERSATION_PASSWORD=
  WORKSPACE_ID=

  #CLOUDANT
  CLOUDANT_URL=

  #INVESTMENT
  PORTFOLIO
  CRED_PORTFOLIO_USERID=
  CRED_PORTFOLIO_PWD=
  URL_GET_PORTFOLIO_HOLDINGS=https://investment-portfolio.mybluemix.net/api/v1/portfolios

  CRED_SIMULATED_INSTRUMENT_ANALYTICS_URL=https://fss-analytics.mybluemix.net/api/v1/scenario/instrument
  CRED_SIMULATED_INSTRUMENT_ANALYTICS_ACCESSTOKEN= CRED_SIMULATED_INSTRUMENT_ANALYTICS_SCENARIO_FILENAME=

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

## 7. Atualizar o arquivo

Uma etapa adicional é a necessidade de comentar duas linhas no arquivo do Controlador para definir o ID do usuário e a senha do serviço Investment Portfolio (linhas 66-70) ![](readme_images/commentlines.png)

## 8. Executar o aplicativo a. Instale as dependências de que seu aplicativo precisa:

```none
npm install
```

b. Inicie o aplicativo localmente:

```none
npm start
```

c. Para testar seu aplicativo, acesse: [http://localhost:3000/](http://localhost:3000/)

Inicie uma conversa com seu bot:
<p align="center">
      <img width="300" height="200" src="readme_images/conversationsample.png" />
</p>


## Configurar o Twilio (Opcional se você quiser que seu aplicativo interaja com o Twilio)

Há mais uma etapa caso você planeje usar o Twilio como interface. Precisamos atualizar mais algumas variáveis de ambiente. Novamente, trata-se de uma etapa opcional. Por padrão, o aplicativo interage com uma WebUI; porém, isso permite uma interface com o Twilio.

**OBSERVAÇÃO:** o uso do Twilio é opcional; o aplicativo funciona com a interface do usuário com a web por padrão. Portanto, faça a configuração do Twilio somente se estiver usando o Twilio.

1. Obtenha um número telefônico do serviço do Twilio, caso ainda não tenha feito isso. https://www.twilio.com/
2. Edite o arquivo .env para incluir credenciais para o Twilio. É possível obter essas informações no painel ao obter um número telefônico para o Twilio.

<p align="center">
  <img width="300" height="250" src="readme_images/Twilio-dashboard.png" />
</p>

  * Defina a variável USE_TWILIO_SMS como *true*.
  * Defina a variável TWILIO_ACCOUNT_SID
  * Defina a variável TWILIO_AUTH_TOKEN
  * Defina a variável TWILIO_NUMBER

  Caso tenha clicado no botão "deploy to Bluemix”, salve os novos valores e reinicie o aplicativo no Bluemix; procure erros nos logs.

  Para o Twilio escutar a porta local (:3000), é necessário configurar um túnel em um webhook. Você pode usar a ferramenta *ngrok* https://ngrok.com/. Prossiga e faça o download da ngrok. Abra uma janela do terminal e abra a ngrok usando o comando:

  ```none
  ngrok http 3000
  ```

  **Observação:** utilize a porta 80 se estiver executando o aplicativo no Bluemix.

  Você receberá uma resposta parecida com esta:

<p align="center">
  <img width="300" height="200" src="readme_images/ngrok-dashboard.png" />
</p>

Copie o URI https e cole-o no campo de entrada do Webhook de SMS (dentro do painel do Twilio):

<p align="center">
  <img width="300" height="200" src="readme_images/webhook-dashboard.png" />
</p>



# Adaptando/Estendendo a Jornada

Para aprimorar o aplicativo atual, você pode incluir serviços financeiros adicionais. A Xignite, Inc. (http://xignite.com) fornece APIs de dados do mercado financeiro com base em Cloud que funcionam junto com os serviços de FinTech do Bluemix. Especificamente, a API Rest GetGlobalDelayedQuotes() está disponível para fornecer cotações atrasadas para um valor mobiliário global determinado.

<p align="center">
  <img width="400" height="150" src="readme_images/Extensions.png" />
</p>

# Resolução de Problemas

  * Para resolver problemas no seu aplicativo do Bluemix, use os logs. Para ver os logs, execute:

  ```bash
  cf logs <application-name> --recent
  ```

  * Em caso de execução local, inspecione as variáveis de ambiente com atenção para confirmar se correspondem.

  As credenciais para serviços do Bluemix (Assistant for Business, Cloudant e Discovery) podem ser encontradas no menu ``Services``, no Bluemix, ao selecionar a opção ``Service Credentials``.


  * Uma alternativa é depurar o aplicativo acessando `https://<name of your application>.mybluemix.net/debug.html` para ver um painel que exibe metadados que contêm detalhes sobre a interação com os serviços que estão sendo usados.

# Licença

[Apache 2.0](LICENÇA)

# Aviso de Privacidade

Este aplicativo da web de amostra de nó inclui código para rastrear implementações no Bluemix e em outras plataformas do Cloud Foundry. As informações a seguir são enviadas para um serviço de Rastreador da Implementação em cada implementação:

* Nome do Aplicativo (`application_name`)
* ID do Espaço (`space_id`)
* Versão do Aplicativo (`application_version`)
* URIs do Aplicativo (`application_uris`)

Esses dados são coletados a partir da variável de ambiente `VCAP_APPLICATION` no IBM Bluemix e em outras plataformas do Cloud Foundry. Esses dados são utilizados pela IBM para o acompanhamento de métricas a respeito de implementações dos mesmos aplicativos no IBM Bluemix. Somente implementações de aplicativos de amostra que incluem código para fazer ping do serviço de Rastreador da Implementação serão acompanhadas.

### Desativando o acompanhamento da implementação

Para desativar o acompanhamento da implementação, remova `require('cf-deployment-tracker-client').track();` do início do arquivo `server.js` na raiz desse repositório.
