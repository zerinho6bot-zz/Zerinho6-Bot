const fs = require("fs"),
{ commandNeeds } = require("../local_storage"),
Commands = fs.readdirSync("./commands").map((v) => v.replace(/.js/gi , "").toLowerCase());

module.exports = {
	/*
	* This function will return a empty string if all the command needs are follow, or a string teeling what the user did wrong.
	* @function
	* @param {object} message - The message object
	* @param {string} command - The command name
	* @returns {string}
	*/
	checkCommandPermissions: function (message, command, t) {

		if (!commandNeeds[command]) {
			return "";
		}

		let commandPerms = commandNeeds[command].options;

		if (commandPerms.onlyowner && message.author.id !== process.env.OWNER) {
			return t("utils:commandUtils.onlyowner");
		}

		if (commandPerms.needArg && message.content.split(" ").length === 1) {
			return t("utils:commandUtils.needArg");
		}

		if (commandPerms.needAttch && !message.attachments.size >= 1) {
			return t("utils:commandUtils.needAttch");
		}
		
		if (commandPerms.needMention && !message.mentions.users.first()) {
			console.log("Returning need mention");
			return t("utils:commandUtils.needMention");
		}

		if (commandPerms.userNeed) {
			if (!message.channel.permissionsFor(message.author.id).has(commandPerms.userNeed)) {
				return `${t("utils:commandUtils.userNeed.part1")} ${commandPerms.userNeed} ${t("utils:commandUtils.userNeed.part2")}`;
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