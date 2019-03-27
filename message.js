/* global Set */

const { COMMAND_UTILS, LANGUAGE_UTILS, MESSAGE_UTILS } = require("./Utils"),
COMMANDS = COMMAND_UTILS.getCommandList();

module.exports.run = function (message) {
	if (message.channel.type === "dm" || message.author.bot || !message.channel.permissionsFor(this.user.id).has("SEND_MESSAGES") || !message.content.startsWith(process.env.PREFIX)) {
		return;
	}

	let { guildLanguage } = require("./local_storage"),
	setUpT = new LANGUAGE_UTILS.setUpT();
	setT = setUpT.setT(guildLanguage[message.guild.id] ? guildLanguage[message.guild.id].language : process.env.LANGUAGE);
	
	let args = message.content.split(" "),
	commandName = args[0].slice(process.env.PREFIX.length).toLowerCase();
	
	if ( !commandName ) {
		return;
	}

	if ( !COMMANDS.includes(commandName) ) {
		return;
	}

	let permissionStr = COMMAND_UTILS.checkCommandPermissions(message, commandName),
	userCD = MESSAGE_UTILS.applyCooldown(message.author.id);

	if (userCD.length > 0) {
		if (userCD.length > 3) {
			message.reply(userCD);
		}
		return;
	}

	if (!permissionStr.length > 0) {
		let start = new Date();

		COMMAND_UTILS.getCommandRequirer(commandName).run(this, message, args.slice(1),start,setUpT.t.bind(setUpT));
	} else {
		message.reply(permissionStr);
	}
}