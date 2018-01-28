'use strict';

process.env.DEBUG = 'actions-on-google:*';

const express = require('express');
const winston = require('winston');
const chalk = require('chalk');
const request = require('request');
const bodyParser = require('body-parser');
const { DialogflowApp } = require('actions-on-google');

const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const START_ACTION = 'start';
const START_TYPE_OF_CAR_ACTION = 'start.typeOfCar';
const VEHICLE_ARGUMENT = 'vehicle';

const googleAssistantRequest = 'google';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

		const app = new App({request, response});

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

		let action = request.body.result.action;
		logger.info(chalk.red(action));

		const parameters = request.body.result.parameters;
		logger.info(chalk.green(parameters));

		const requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;

		logger.info(chalk.red('Request headers: ' + JSON.stringify(request.headers)));
		logger.info(chalk.red('Request body: ' + JSON.stringify(request.body)));

		function firstTry(app) {
				if(requestSource === googleAssistantRequest) {
						app.ask('Alright you did this correct')
				}
				else {
						let responseJSON = {};
						responseJSON.speech = 'Nice';
						responseJSON.displayText = 'Nice in text';
						response.json(responseJSON);
				}
		}

		function typeOfCar(app) {
				if(requestSource === googleAssistantRequest) {
						app.tell('You should reconsider')
				}
				else {
						let responseJSON = {};
						responseJSON.speech = 'Nice car';
						responseJSON.displayText = 'Nice car in text';
						response.json(responseJSON);
				}
		}

		let actionMap = new Map();
		actionMap.set(START_ACTION, firstTry());
		actionMap.set(START_TYPE_OF_CAR_ACTION, typeOfCar());

		app.handleRequest(actionMap)
});
