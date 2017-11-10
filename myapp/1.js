var builder = require('botbuilder');
var restify = require('restify');
var Client = require('node-rest-client').Client;
var client = new Client();
const UserPasswordReset = 'Change Password'; 


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Creating the UniversalBot
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the SapphireIMS Bot");
        session.beginDialog('UserInformation');
    }]);
	
	

bot.dialog('UserInformation', [
function (session) {
	builder.Prompts.text(session, 'Hello... What\'s your name?');
},
function (session, results) {`
	session.userData.name = results.response;
	console.log(session.userData.name);
	
	client.get("http://172.16.11.24:8181/AutomationJobs/webresources/items/GetUserDetail/"+ session.userData.name, function (data, response) {
		
		if( response["statusCode"] == 200 )
		{
			console.log("Response got"+data["value"]);
			
			//if( data["value"] == null || data["value].length != 0 )
			{
				function(session) {
					builder.Prompts.choice(session, "Hello "+ data["value"] + " \n How can I help you today?", "UserPasswordReset|USB Enable|Account Password Reset", { listStyle: builder.ListStyle.button });
				},
					function (session, results) {
						session.send("result.response"+result.response);
						if (result.response) {
							session.send("result.response"+result.response);
							 switch (result.response) {
								case UserPasswordReset:
									session.beginDialog('PasswordReset');
								break;
							 }
						}
					}
				
			}
		}
			
    // parsed response body as js object 
    //console.log(data);
    // raw response 
    //console.log(response);
});

	//builder.Prompts.number(session, 'Hi ' + results.response + ', How many years have you been coding?');
	session.endDialog();
}]);
	
	
bot.dialog('PasswordReset', [
function (session) {
	
	builder.Prompts.text(session, 'Kindly enter the Password?');
},
function (session, results) {
	var password  = results.response;
	builder.Prompts.text(session, 'Kindly confrim the Password?');
},
	function (session) {
	},
	function (session, results) {
		var confirmpassword  = results.response;
		if (password == password) 
		{
			builder.Prompts.number(session, 'Kindly enter the PIN?');
		}
		else{
			session.send("Passwords are not matched");
			session.endDialog();
		}
	}	
]);
//session.beginDialog('resetPassword:/');

//Sub-Dialogs
bot.library(require('./dialogs/reset-password'));


server.post('/api/messages1', connector.listen());

