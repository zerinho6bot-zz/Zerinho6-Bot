const Fs = require("fs");
const { commandNeeds, commandAvailables } = require("../local_storage");
const Commands = Fs.readdirSync("./commands").map((v) => v.replace(/.js/gi , ""));

/**
* Sets up the key from where isType function will get properties.
* @function
* @param {object} options - Basicly a JSON file or a key with properties
* @return {object}
*/
function setIsType(options){
	/**
	* A function to check if the typeof propertie is equal to the expected type.
	* @function
	* @param {string} propertie - The propertie that you want from options
	* @param {string} type - The type to check if it's or not  
	*/
	return function isType(propertie, type) {
		return typeof options[propertie] === type;
	};
}

module.exports = {
	/**
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

		const CommandPerms = commandNeeds[command].options;
		const Args = message.content.split(" ").slice(1);
		const IsType = setIsType(CommandPerms);

		if (CommandPerms.onlyOwner && message.author.id !== process.env.OWNER) {
			return t("utils:commandUtils.onlyOwner");
		}

		if (CommandPerms.specificAuthor) {
			if (IsType("specificAuthor", "object") && !CommandPerms.specificAuthor.includes(message.author.id)) {
				return `${t("utils:commandUtils.specificNeeds.specificAuthor.pluralReturn")} ${CommandPerms.specificAuthor.join(", ")}`;
			} else if (message.author.id !== CommandPerms.specificAuthor) {
				return `${t("utils:commandUtils.specificNeeds.specificAuthor.defaultReturn")} ${CommandPerms.specificAuthor}`;
			}
		}

		if (CommandPerms.specificGuild) {
			if (IsType("specificGuild", "object") && !CommandPerms.specificGuild.includes(message.guild.id)) {
				return `${t("utils:commandUtils.specificNeeds.specificGuild.pluralReturn")} ${CommandPerms.specificGuild.join(", ")}`;
			} else if (message.guild.id !== CommandPerms.specificGuild) {
				return `${t("utils:commandUtils.specificNeeds.specificGuild.defaultReturn")} ${CommandPerms.specificGuild}`;
			}
		}

		if (CommandPerms.specificChannel) {

			if (IsType("specificChannel", "object") && !CommandPerms.specificChannel.includes(message.channel.id)) {
				return `${t("utils:commandUtils.specificNeeds.specificChannel.pluralReturn")} ${CommandPerms.specificChannel.join(", ")}`;
			} else if (message.channel.id !== CommandPerms.specificChannel) {
				return `${t("utils:commandUtils.specificNeeds.specificChannel.defaultReturn")} ${CommandPerms.specificChannel}`;
			}
		}
		//
		if (CommandPerms.specificRole) {
			const Roles = message.member.roles;

			if (isNaN(CommandPerms.specificRole) && !Roles.find((r) => r.name.toLowerCase() === CommandPerms.specificRole)){
				return `${t("utils:commandUtils.specificNeeds.specificRole.nameReturn")} ${CommandPerms.specificRole}`;
			} else if (!Roles.has(CommandPerms.specificRole)) {
				return `${t("utils:commandUtils.specificNeeds.specificRole.defaultReturn")} ${CommandPerms.specificRole}`;
			}
		}

		if (CommandPerms.needArg) {
			if (IsType("needArg", "number") && CommandPerms.needArg > Args.length) {
				return `${t("utils:commandUtils.needArg.thisCommandNeeds")} **${CommandPerms.needArg}** ${t("utils:commandUtils.needArg.arguments")} ${t("utils:commandUtils.needArg.andYourMessageOnlyHave")} **${Args.length}** ${t("utils:commandUtils.needArg.arguments")}`;
			} else if (!Args.length >= 1) {
				return t("utils:commandUtils.needArg.default");
			}
		}

		if (CommandPerms.needAttch) {
			if (IsType("needAttch", "number") && !message.attachments.size >= CommandPerms.needAttch) {
				return `${t("utils:commandUtils.needAttch.default")} ${CommandPerms.needAttch} ${t("utils:commandUtils.needAttch.attachments")}`;
			} else if (!message.attachments.size >= 1) {
				return `${t("utils:commandUtils.needAttch.default")} 1 ${t("utils:commandUtils.needAttch.attachment")}`;
			}
		}
		
		if (CommandPerms.needMention) {
			if (IsType("needMention", "number") && !message.mentions.users.size >= CommandPerms.needMention) {
				return `${t("utils:commandUtils.needMention.needToMention")} ${CommandPerms.needMention} ${t("utils:commandUtils.needMention.users")} ${t("utils:commandUtils.needMention.inOrderTo")}`;
			} else if (!message.mentions.users.first()) {
				return `${t("utils:commandUtils.needMention.needToMention")} ${t("utils:commandUtils.needMention.users")} ${t("utils:commandUtils.needMention.inOrderTo")}`;
			}
		}

		if (CommandPerms.userNeed) {
			if (!message.channel.permissionsFor(message.author.id).has(CommandPerms.userNeed)) {
				return `${t("utils:commandUtils.userNeed.part1")} ${CommandPerms.userNeed} ${t("utils:commandUtils.userNeed.part2")}`;
			}
		}

		if (CommandPerms.guildOwner && message.author.id !== message.guild.owner.user.id) {
			return t("utils:commandUtils.guildOwner");
		}

		return "";
	},
	/**
	* This function returns every command listed on command_needs.json
	* @function
	* @retuns {Array<string>}
	*/
	getCommandList: function() {
		return Commands;
	},
	/**
	* This function returns the require of the given command
	* @param {string} command - The command name
	* @returns {object}
	*/
	getCommandRequirer: function(command) {
		let requires = require("../requires.js");

		return requires[command];
	},
	/**
	* Returns a list of commands that the user can use.
	* @function
	* @param {object} message - The message object
	* @returns {string}
	*/
	getAvailableCommandsForUser(message) {
		let commands = commandAvailables.all.join(", ");
		const Keys = Object.keys(commandAvailables);

		for (let i = 1; i < Keys.length; i++) {
			const Elem = Keys[i];

			if (Elem === "owner" && message.author.id !== process.env.OWNER) {
				continue;
			}

			if (Elem.startsWith("p.") && !message.channel.permissionsFor(message.author.id).has(Elem.replace("p.", ""))) {
				continue;
			}

			const RoleVerify = Elem.startsWith("r.") ? Elem.replace("r.", "") : null;

			if (RoleVerify !== null) {
				const Roles = message.member.roles;

				if (isNaN(RoleVerify) && !Roles.find((r) => r.name.toLowerCase() === RoleVerify)) {
					continue;
				} else if (!Roles.has(RoleVerify)) {
					continue;
				}
			}

			if (Elem.startsWith("c.") && message.channel.id !== Elem.replace("c.", "")) {
				continue;
			}

			if (Elem.startsWith("g.") && message.guild.id !== Elem.replace("g.", "")) {
				continue;
			}

			if (Elem.startsWith("a.") && message.author.id !== Elem.replace("a.", "")) {
				continue;
			}
			commands += ", " + commandAvailables[Elem].join(", ");
		}

		return commands;
	}
};