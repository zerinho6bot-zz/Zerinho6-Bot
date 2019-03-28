const fs = require("fs"),
{ commandNeeds } = require("../local_storage"),
Commands = fs.readdirSync("./commands").map( (v) => v.replace( /.js/gi , "").toLowerCase() );

module.exports = {
	/*
	* This function will return a empty string if all the command needs are follow, or a string teeling what the user did wrong.
	* @function
	* @param {object} message - The message object
	* @param {string} command - The command name
	* @returns {string}
	*/
	checkCommandPermissions: function (message, command) {

		if (!commandNeeds[command]) {
			return "";
		}

		let commandPerms = commandNeeds[command].options;

		if (commandPerms.onlyowner && message.author.id !== process.env.OWNER) {
			return "Only Owner!";
		}

		if (commandPerms.needArg && message.content.split(" ").length === 1) {
			return "That command need argument.";
		}

		if (commandPerms.needMention && !message.mentions.users.first()) {
			return "You also need to mention someone.";
		}

		if (commandPerms.userNeed) {
			if (!message.channel.permissionsFor(message.author.id).has(commandPerms.userNeed)) {
				return `You need ${commandPerms.userNeed} permission to use that command.`;
			}
		}

		return "";
	},
	/*
	* This function returns every command listed on command_needs.json
	* @function
	* @retuns {Array<string>}
	*/
	getCommandList: function() {
		return Commands;
	},
	/*
	* This function returns the require of the given command
	* @param {string} command - The command name
	* @returns {object}
	*/
	getCommandRequirer: function(command) {
		let requires = require("../requires.js");

		return requires[command];
	}
};
