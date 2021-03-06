var builder = require('botbuilder');
var restify = require('restify');
var Client = require('node-rest-client').Client;
var client = new Client();
const UserPasswordReset = 'Change Password'; 
const USBEnable = 'USB Enable';
const AccountPasswordReset='AccountPasswordReset';


var server_port =  process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.IP  || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

var server = restify.createServer(); 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});



// Setup Restify Server


/*server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

/*
var server = restify.createServer(options);
server.listen(process.env.port || process.env.PORT || 4444, function () {
    console.log('%s listening to %s', server.name, server.url);
});*/

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
	
var DialogLabels = {
    PasswordReset: 'Password Reset',
    AutomationJobs: 'Automation Jobs'
};

bot.dialog('UserInformation', [
function (session) {
	builder.Prompts.text(session, 'Hello... What\'s your name?');
}, 

function(session, result, next){
	session.send("Looking for Name");
	client.get("http://gaia:8181/AutomationJobs/webresources/items/GetUserDetail/"+ session.userData.name, function (data, response) {
		
		if( response["statusCode"] != 200 )
		{
			session.endDialog();
		   
			
		}
		else
		{
			session.dialogData.fullname=data["value"] ;
			next();
			
		}
	})
	
},
function (session) {
		builder.Prompts.choice(session, "Hello "+ session.dialogData.fullname + " \n How can I help you today?", "UserPasswordReset|USBEnable|AccountPasswordReset", { listStyle: builder.ListStyle.button });
		//next();
	},
	function (session, results) {
		session.send("result.response"+result.response);
		//if (result.response) {
							session.send("result.response"+result.response);
							 //switch (result.response) {
								//case UserPasswordReset:
									session.beginDialog('PasswordReset');
								//break;
							 //}
	//	}
	}

]);

bot.dialog('PasswordReset', [
function (session) {
	
	builder.Prompts.text(session, 'Kindly enter the Password?');
	
},
function (session, results, next) {
	var password  = results.response;
	//next();
	
},
	function (session) {
		builder.Prompts.text(session, 'Kindly confirm the Password?');
		
	},
	function (session, results, next) {
		var confirmpassword  = results.response;
		if (1 == 1) 
		{
			//next();
			
		}
		else{
			session.send("Passwords are not matched");
			session.endDialog();
		}
	},
function (session) {
	
	builder.Prompts.number(session, 'Kindly enter the PIN?');
	
},
function (session, results, next) {
	session.send("Passwords reset Completed");
			session.endDialog();
	
}	
]);

server.post('/', connector.listen());
