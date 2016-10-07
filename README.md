# To Do List
A simple To-Do list application using openUI5 and node-json-db.

## Try it out
1. Clone the repo and run ```npm install``` to install the required dependencies.
2. Start the local server by running ```node index.js```
3. Open http://localhost:8000 on your web browser to start the app

#### Note:
The app currently gets the openUI5 resources from the CDN. To speed up running the app locally, you can download the openUI5 runtime from [openui5.org](http://openui5.org) and put them in a folder called 'resources' inside the app folder, and change the bootstrap in the app/index.html file from this:

```<script src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"```

to this:

```<script src="resources/sap-ui-core.js"```
