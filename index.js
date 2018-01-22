const express = require('express');
const winston = require('winston');
const chalk = require('chalk');
const { DialogflowApp } = require('actions-on-google');

const app = express();

const loggerTimeFormat = () => (new Date()).toLocaleTimeString();

winston.loggers.add('DEFAULT_LOGGER', {
		console: {
				colorize: true,
				json: false,
				timestamp: () => {
						return new Date().toLocaleTimeString();
				}
		}
});

const logger = winston.loggers.get('DEFAULT_LOGGER');

app.set("port", 3000);

app.get('/', function (req, res) {
		logger.info('Hello');
    res.send('Hello World');
});

app.listen(app.get("port"), ()=> {
		logger.info('App running in 3000....');
});

app.post('/webhool', (req, res) => {

		const DialogApp = new DialogflowApp({req, res});


});
