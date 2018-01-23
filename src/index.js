const express = require('express');
const winston = require('winston');
const chalk = require('chalk');
const request = require('request');
const bodyParser = require('body-parser');
const { DialogflowApp } = require('actions-on-google');

const app = express();

let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({extended: false});

const loggerTimeFormat = () => (new Date()).toLocaleTimeString();

winston.loggers.add('DEFAULT_LOGGER', {
		console: {
				colorize: true,
				fileName: 'logger.log',
				prettyPrint: true,
				json: false,
				timestamp: () => {
						return new Date().toLocaleTimeString();
				}
		}
});

const logger = winston.loggers.get('DEFAULT_LOGGER');

app.set("port", 5000);

app.get('/', function (req, res) {
		logger.info('Hello');
    res.send('Hello World');
});

app.listen(app.get("port"), ()=> {
		logger.info('App running in 3000....');
});

app.get('/users', jsonParser, (req, res) => {
		logger.info(chalk.red('In users'));
		res.json([
				{"id": 1},
				{"id": 2}
		])
});

app.post('/webhook', jsonParser, (req, response) => {

		const DialogApp = new DialogflowApp({req, response});


		logger.info('Request Headers: ' + JSON.stringify(req.headers));
		logger.info('Request body: ' + JSON.stringify(req.body));

		request('http://localhost:5000/users', (req1, res1, body1) => {
				logger.info('statusCode: ', res1 && res1.statusCode);
				logger.info('body :', body1);
		})
});
