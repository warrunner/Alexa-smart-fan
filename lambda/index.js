/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const firebase = require('firebase/app');
require('firebase/database');

// PLEASE FILL IN YOUR VALUES INSIDE CONFIG OBJECT. REFER TO THIS TUTORIAL TO GET STARTED : 

const config = {
   apiKey: "API_KEY",
   authDomain: "PROJECT_ID.firebaseapp.com",
   databaseURL: "https://PROJECT_ID.firebaseio.com",
   projectId: "PROJECT_ID",
   storageBucket: "PROJECT_ID.appspot.com",
   messagingSenderId: "SENDER_ID",
   appId: "APP_ID",
   measurementId: "G-MEASUREMENT_ID",
};

firebase.initializeApp(config);
const database = firebase.database();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        var speakOutput = 'Welcome! You can record your Mood right now. For example, say "Add cool" ';
        try{
            firebase.database().goOnline();
            var speedVar, switchCondition, idealSpeed, fanMode;
            await database.ref().child('android').child('test').get().then((snapshot) => {
                    if (snapshot.exists()) {
                        speedVar = snapshot.val();
                    } else {
                        console.log('No data available');
                        speedVar = 'sorry';
                    }
                })
            
            await database.ref().child('android').child('switch').get().then((snapshot) => {
                if(snapshot.exists()) {
                    switchCondition = snapshot.val();
                } else {
                    console.log('No data available');
                    switchCondition - 'sorry';
                }
            })
            
            await database.ref().child('controller').child('test').get().then((snapshot) => {
                if(snapshot.exists()) {
                    idealSpeed = snapshot.val();
                } else {
                    console.log('No data available');
                    idealSpeed = 'sorry';
                }
            })
            
            await database.ref().child('android').child('mode').get().then((snapshot) => {
                if(snapshot.exists()) {
                    fanMode = snapshot.val();
                } else {
                    console.log('No data available');
                    fanMode = 'sorry';
                }
            })
            firebase.database().goOffline();
            if(switchCondition === 'off') {
                speakOutput = 'The fan is switched off, would you like to switch on the fan? The suggested speed is ' + idealSpeed;
            } else{
                speakOutput = 'The fan is currently swtiched on and the mode is ' + fanMode + '. The suggested fan speed is ' + idealSpeed;
            }
        }catch(e){
            console.log("Catch logs here: ",e);
            speakOutput = `There was a problem adding the `;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const ParamHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'paramIntent'
    },
    async handle(handlerInput) {
        let speakOutput = '';
        let parameter = handlerInput.requestEnvelope.request.intent.slots.param.value;
        
        //current speed get method
        if(parameter ==='current') {
            try{
            firebase.database().goOnline();
            var speedVar;
            await database.ref().child('android').child('test').get().then((snapshot) => {
                    if (snapshot.exists()) {
                        speedVar = snapshot.val();
                    } else {
                        console.log('No data available');
                        speedVar = 'sorry';
                    }
                })
            firebase.database().goOffline();
            speakOutput = 'The current speed is ' + speedVar;
        }catch(e){
            console.log("Catch logs here: ",e);
            speakOutput = `There was a problem adding the `;
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
        }
        
        if(parameter === 'temperature' || parameter === 'humidity' || parameter === 'conditions')
        {
            try{
                firebase.database().goOnline();
                var temp, hum;
                await database.ref().child('controller').child('temp').get().then((snapshot) => {
                    if(snapshot.exists()){
                        temp = snapshot.val();
                    }else {
                        console.log('No data available');
                        temp = 'error';
                    }
                })
                await database.ref().child('controller').child('hum').get().then((snapshot) => {
                    if(snapshot.exists()){
                        hum = snapshot.val();
                    }else {
                        console.log('No data available');
                        hum = 'error';
                    }
                })
                firebase.database().goOffline();
                speakOutput = 'Current temperature is ' + temp + ' degree celsius and humidity is ' + hum + ' percent';
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with temp';
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
           
        }
        
        if(parameter === 'mode') {
            try{
                firebase.database().goOnline();
                var mode;
                await database.ref().child('android').child('mode').get().then((snapshot) => {
                    if(snapshot.exists()){
                        mode = snapshot.val();
                    }else {
                        console.log('No data available');
                        mode = 'error';
                    }
                })
                firebase.database().goOffline();
                speakOutput = 'The fan is in ' + mode + ' mode';
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with mode';
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
        }
        
        if(parameter === 'the fan') {
            try{
                firebase.database().goOnline();
                var switchState;
                await database.ref().child('android').child('switch').get().then((snapshot) => {
                    if(snapshot.exists()){
                        switchState = snapshot.val();
                    }else {
                        console.log('No data available');
                        switchState = 'error';
                    }
                })
                firebase.database().goOffline();
                speakOutput = 'The fan is currently ' + switchState;
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with switch';
            }
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const SetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'setIntent';
    },
    
    async handle(handlerInput) {
        let speakOutput = '';
        let parameter = handlerInput.requestEnvelope.request.intent.slots.param.value;
        let setVal = handlerInput.requestEnvelope.request.intent.slots.setters.value;
        
        if(parameter === 'switch' && (setVal === 'on' || setVal === 'off'))
        {
            try{
                firebase.database().goOnline();
                await database.ref('/android/switch').set(setVal)
            firebase.database().goOffline();
            speakOutput = 'The fan is switched ' + setVal;
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with setting switch';
            }
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
        }
        
        if((parameter === 'switch' || parameter === 'set') && (setVal === 'auto' || setVal === 'manual'))
        {
            try{
                firebase.database().goOnline();
                await database.ref('android/mode').set(setVal)
                firebase.database().goOffline();
                speakOutput = 'The fan is switched to ' + setVal + ' mode';
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with setting mode';
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
        }
        
        if(parameter === 'set' && (setVal === '1' || setVal ==='2' || setVal === '3' || setVal === '4' || setVal === '5'))
        {
            try{
                firebase.database().goOnline();
                await database.ref('android/test').set(setVal)
                firebase.database().goOffline();
                speakOutput = 'The fan speed is set to ' + setVal;
            } catch(e) {
                console.log("Catch logs here: ", e);
                speakOutput = 'there was a problem with setting fan speed';
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
        }
    }
}
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ParamHandler,
        SetIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
