'use strict';

process.env.DEBUG = 'actions-on-google:*';

const express = require('express');
const winston = require('winston');
const chalk = require('chalk');
// const request = require('request');
const bodyParser = require('body-parser');
const {DialogflowApp} = require('actions-on-google');

const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const START_ACTION = 'start';
const START_TYPE_OF_CAR_ACTION = 'start.typeOfCar';
const SELECTED_OPTION = 'action.intent.o';
const VEHICLE_ARGUMENT = 'vehicle';

const googleAssistantRequest = 'google';

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

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

		logger.info(chalk.red('Request headers: ' + JSON.stringify(request.headers)));
		logger.info(chalk.red('Request body: ' + JSON.stringify(request.body)));

		if(request.body.result) {
				processV1Request(request, response);
		}else if (request.body.queryResult) {
				processV2Request(request, response);
		} else {
				logger.alert(chalk.red('Invalid Request'));
				return response.status(400).end('Invalid Webhook Request (expecting V1 or V2 request');
		}

		function processV1Request(request, response) {

				logger.info(chalk.bgRed('V1 Request'));
				// const app = new App({request, response});
				const dApp = new DialogflowApp({request: request, response: response});

				let action = request.body.result.action;
				logger.info(chalk.red(action));

				const parameters = request.body.result.parameters;
				logger.info(chalk.green(parameters));

				const requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;


				function firstTry(dApp) {
						logger.info(chalk.green('First Try'));
						if (requestSource === googleAssistantRequest) {
								dApp.tell('Alright you did this correct')
						}
						else {
								let responseJSON = {};
								responseJSON.speech = 'Nice';
								responseJSON.displayText = 'Nice in text';
								response.json(responseJSON);
						}
				}

				function typeOfCar(dApp) {
						logger.info('typeOfCar');
						if (requestSource === googleAssistantRequest) {
								dApp.tell('You should reconsider')
						}
						else {
								let responseJSON = {};
								responseJSON.speech = 'Nice car';
								responseJSON.displayText = 'Nice car in text';
								response.json(responseJSON);
						}
				}

				function selectedOption(dApp) {
						logger.info('Selected Option');
						if (requestSource === googleAssistantRequest) {
								dApp.ask(dApp
										.buildRichResponse()
										.addSimpleResponse('This is right?')
										.addSuggestions('Chips')
								);
						} else {
								let responseJSON = {};
								responseJSON.speech = 'no';
								responseJSON.displayText = 'Way';
								response.json(responseJSON);
						}

				}


				const actionMap = new Map();
				actionMap.set(START_ACTION, firstTry);
				actionMap.set(START_TYPE_OF_CAR_ACTION, typeOfCar);
				actionMap.set(SELECTED_OPTION, selectedOption);

				dApp.handleRequest(actionMap)
		}


});
